"use client";

import React, { useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, Paperclip, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateTaskModal } from "./CreateTaskModal";
import { CreateColumnModal } from "./CreateColumnModal";
import { getImageUrl } from "@/lib/utils";
import { AvatarImage } from "@/components/ui/avatar";
import { taskService } from "@/services/task.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BoardCanvas({ initialColumns, priorityStyles, members = [] }: any) {
  const [columns, setColumns] = useState(initialColumns);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // When Next.js server actions / router.refresh() pass down fresh data, update the local state!
  React.useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (image, doc, pdf, pptx)
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' // pptx
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image, PDF, DOC, or PPTX.");
      return;
    }

    setUploadingTaskId(taskId);
    try {
      const res = await taskService.addAttachment(taskId, file);
      if (res.success) {
        toast.success("Attachment added successfully!");
        router.refresh();
      } else {
        toast.error("Failed to upload attachment");
      }
    } catch (error) {
      toast.error("Failed to upload attachment");
    } finally {
      setUploadingTaskId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openAttachment = (url: string) => {
    window.open(getImageUrl(url) as string, '_blank');
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColIndex = columns.findIndex((col: any) => col.id === source.droppableId);
    const destColIndex = columns.findIndex((col: any) => col.id === destination.droppableId);

    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];

    const sourceTasks = [...sourceCol.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destCol.tasks];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    const newColumns = [...columns];
    newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
    if (source.droppableId !== destination.droppableId) {
      newColumns[destColIndex] = { ...destCol, tasks: destTasks };
    }

    setColumns(newColumns);
    
    // Here we would emit to WebSocket and call API to persist
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full pb-4">
        {columns.map((col: any) => (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col">
            {/* Column Header */}
            <div className={`mb-3 pb-2 border-b-2 ${col.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  {col.title}
                  <span className="bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full font-medium">
                    {col.tasks.length}
                  </span>
                </h3>
                <button className="p-1 hover:bg-slate-200/50 rounded text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto overflow-x-hidden min-h-[150px] p-1.5 -mx-1.5 rounded-lg transition-colors duration-200 ${
                    snapshot.isDraggingOver ? "bg-slate-100/50" : "bg-transparent"
                  }`}
                >
                  {col.tasks.map((task: any, index: number) => {
                    const styles = priorityStyles[task.priority] || priorityStyles.Medium;
                    
                    return (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`group p-4 rounded-xl border transition-all relative mb-3 ${
                              styles.cardBg
                            } ${snapshot.isDragging ? "shadow-lg scale-[1.02] ring-2 ring-indigo-500/20 z-50" : "shadow-sm hover:shadow-md"}`}
                          >
                            {/* Priority & Options */}
                            <div className="flex items-start justify-between mb-3">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${styles.pill}`}
                              >
                                {task.priority}
                              </span>
                              <div className="flex items-center gap-1">
                                {/* Hidden file input attached to this task */}
                                <input 
                                  type="file" 
                                  id={`upload-${task.id}`} 
                                  className="hidden" 
                                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                                  onChange={(e) => handleFileUpload(e, task.id)}
                                />
                                
                                <button 
                                  onClick={() => document.getElementById(`upload-${task.id}`)?.click()}
                                  className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded transition-all ${styles.icon}`}
                                  title="Add Attachment"
                                >
                                  {uploadingTaskId === task.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Paperclip className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded transition-all ${styles.icon}`}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Title & Description */}
                            <h4 className={`text-sm font-semibold leading-snug mb-1.5 ${styles.text}`}>
                              {task.title}
                            </h4>
                            
                            {task.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                {task.description}
                              </p>
                            )}

                            {/* Attachments List */}
                            {task.attachments && task.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {task.attachments.map((att: any) => (
                                  <button
                                    key={att.id}
                                    onClick={() => openAttachment(att.url)}
                                    className="flex items-center gap-1 bg-white/60 hover:bg-white text-slate-600 text-[10px] font-medium px-2 py-1 rounded border border-slate-200/60 shadow-sm transition-colors max-w-full"
                                    title={att.filename}
                                  >
                                    <Paperclip className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate max-w-[120px]">{att.filename}</span>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-200/50">
                              <div className={`flex items-center gap-3 ${styles.icon}`}>
                                {task.comments > 0 && (
                                  <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {task.comments}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center -space-x-1.5">
                                {task.assignee ? (
                                  <Avatar className="h-6 w-6 border-2 border-white shadow-sm bg-white">
                                    {task.assignee.photo && <AvatarImage src={getImageUrl(task.assignee.photo) as string} />}
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                      {task.assignee.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="h-6 w-6 rounded-full border-2 border-white shadow-sm bg-slate-50 flex items-center justify-center border-dashed border-slate-300">
                                    <span className="text-[10px] font-bold text-slate-400">?</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  
                  {/* Add Task Button */}
                  <CreateTaskModal columnId={col.id} members={members}>
                    <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors border border-transparent border-dashed hover:border-slate-300 mt-2">
                      <Plus className="w-4 h-4" />
                      Add task
                    </button>
                  </CreateTaskModal>
                </div>
              )}
            </Droppable>
          </div>
        ))}

        {/* Add Column Button */}
        <div className="flex-shrink-0 w-80">
          <CreateColumnModal>
            <button className="w-full py-3 px-4 flex items-center gap-2 text-sm font-medium text-slate-500 bg-white/50 hover:bg-white border-2 border-slate-200/50 hover:border-slate-300 rounded-xl transition-all shadow-sm">
              <Plus className="w-5 h-5" />
              Add new column
            </button>
          </CreateColumnModal>
        </div>
      </div>
    </DragDropContext>
  );
}
