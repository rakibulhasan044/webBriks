"use client";
import React, { useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, Paperclip, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateTaskModal } from "./CreateTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { getImageUrl } from "@/lib/utils";
import { AvatarImage } from "@/components/ui/avatar";
import { taskService } from "@/services/task.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BoardCanvas({ boardId, initialColumns, priorityStyles, members = [] }: any) {
  const [columns, setColumns] = useState(initialColumns);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{id: string, title: string} | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // When Next.js server actions / router.refresh() pass down fresh data, update the local state!
  React.useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  React.useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6001/api/v1';
    const socketUrl = new URL(baseUrl).origin;
    
    const socket = io(`${socketUrl}/boards`, {
      auth: { token }
    });

    socket.on('connect', () => {
      socket.emit('join_board', boardId);
    });

    const handleUpdate = () => {
      router.refresh();
    };

    socket.on('task_created', handleUpdate);
    socket.on('task_updated', handleUpdate);
    socket.on('task_deleted', handleUpdate);
    socket.on('column_created', handleUpdate);
    socket.on('column_updated', handleUpdate);
    socket.on('column_deleted', handleUpdate);

    return () => {
      socket.emit('leave_board', boardId);
      socket.disconnect();
    };
  }, [boardId, router]);

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
        toast.error(res?.message || "Failed to upload attachment");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload attachment");
    } finally {
      setUploadingTaskId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistic UI update: instantly remove task from screen
    setColumns(prev => prev.map((col: any) => ({
      ...col,
      tasks: col.tasks.filter((t: any) => t.id !== taskId)
    })));

    try {
      const res = await taskService.deleteTask(taskId);
      if (res.success) {
        toast.success("Task deleted successfully");
        router.refresh(); // Background sync
      } else {
        toast.error(res.message || "Failed to delete task");
        setColumns(initialColumns); // Rollback on failure
      }
    } catch (error: any) {
      toast.error(error.message || "You don't have permission to delete this task");
      setColumns(initialColumns); // Rollback on failure
    }
  };

    React.useEffect(() => {
    const handleEvent = (e: any) => {
      const { columnId, payload } = e.detail;
      
      const tempTask = {
        id: "temp-" + Date.now(),
        title: payload.title,
        description: payload.description,
        priority: payload.priority ? payload.priority.charAt(0).toUpperCase() + payload.priority.slice(1).toLowerCase() : "Medium",
        comments: 0,
        attachments: [],
        assignees: payload.assigneeIds ? payload.assigneeIds.map((id: string) => members.find((m: any) => m.id === id)).filter(Boolean) : []
      };

      setColumns(prev => prev.map((col: any) => {
        if (col.id === columnId) {
          return { ...col, tasks: [...col.tasks, tempTask] };
        }
        return col;
      }));
    };
    
    window.addEventListener('optimisticCreate', handleEvent);
    return () => window.removeEventListener('optimisticCreate', handleEvent);
  }, [members]);

  const handleOptimisticCreate = (columnId: string, payload: any) => {
    // Generate a temporary fake task to instantly place on the board
    const tempTask = {
      id: "temp-" + Date.now(),
      title: payload.title,
      description: payload.description,
      priority: payload.priority ? payload.priority.charAt(0).toUpperCase() + payload.priority.slice(1).toLowerCase() : "Medium",
      comments: 0,
      attachments: [],
      assignees: payload.assigneeIds ? payload.assigneeIds.map((id: string) => members.find((m: any) => m.id === id)).filter(Boolean) : []
    };

    setColumns(prev => prev.map((col: any) => {
      if (col.id === columnId) {
        return { ...col, tasks: [...col.tasks, tempTask] }; // Append to bottom as new tasks usually go to bottom, or prepend
      }
      return col;
    }));
  };

  const openAttachment = (url: string) => {
    window.open(getImageUrl(url) as string, '_blank');
  };

  const onDragEnd = async (result: DropResult) => {
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

    // Fractional indexing to calculate the exact position
    let newPosition = 1000;
    const destTasksCount = destTasks.length;
    
    if (destTasksCount === 1) {
      newPosition = 1000; // First task ever in this column
    } else if (destination.index === 0) {
      // Moved to top
      const nextTask = destTasks[1];
      newPosition = Number(nextTask?.position || 1000) - 1000;
    } else if (destination.index === destTasksCount - 1) {
      // Moved to bottom
      const prevTask = destTasks[destTasksCount - 2];
      newPosition = Number(prevTask?.position || 1000) + 1000;
    } else {
      // Moved in between two tasks
      const prevTask = destTasks[destination.index - 1];
      const nextTask = destTasks[destination.index + 1];
      const prevPos = Number(prevTask?.position || 1000);
      const nextPos = Number(nextTask?.position || prevPos + 2000);
      newPosition = (prevPos + nextPos) / 2;
    }

    movedTask.position = newPosition;
    movedTask.columnId = destination.droppableId;

    const newColumns = [...columns];
    newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
    if (source.droppableId !== destination.droppableId) {
      newColumns[destColIndex] = { ...destCol, tasks: destTasks };
    }

    setColumns(newColumns); // Optimistic UI update
    
    try {
      const res = await taskService.updateTask(movedTask.id, {
        columnId: destination.droppableId,
        position: newPosition
      });
      if (!res.success) {
        toast.error(res.message || "Failed to update task position");
        setColumns(initialColumns); // Revert on failure
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred while moving the task");
      setColumns(initialColumns); // Revert on failure
    }
  };

return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full pb-4">
        {columns.map((col: any, colIndex: number) => {
          // Assign a unique pastel theme to each column
          const columnThemes = [
            { bg: "bg-amber-50", border: "border-amber-200", headerBg: "bg-amber-100/50", text: "text-amber-900", count: "bg-amber-200 text-amber-800", hover: "hover:bg-amber-200/50", dragOver: "bg-amber-100/80", addBtn: "hover:bg-amber-200/50 hover:text-amber-700 hover:border-amber-300 text-amber-600" },
            { bg: "bg-emerald-50", border: "border-emerald-200", headerBg: "bg-emerald-100/50", text: "text-emerald-900", count: "bg-emerald-200 text-emerald-800", hover: "hover:bg-emerald-200/50", dragOver: "bg-emerald-100/80", addBtn: "hover:bg-emerald-200/50 hover:text-emerald-700 hover:border-emerald-300 text-emerald-600" },
            { bg: "bg-sky-50", border: "border-sky-200", headerBg: "bg-sky-100/50", text: "text-sky-900", count: "bg-sky-200 text-sky-800", hover: "hover:bg-sky-200/50", dragOver: "bg-sky-100/80", addBtn: "hover:bg-sky-200/50 hover:text-sky-700 hover:border-sky-300 text-sky-600" },
            { bg: "bg-violet-50", border: "border-violet-200", headerBg: "bg-violet-100/50", text: "text-violet-900", count: "bg-violet-200 text-violet-800", hover: "hover:bg-violet-200/50", dragOver: "bg-violet-100/80", addBtn: "hover:bg-violet-200/50 hover:text-violet-700 hover:border-violet-300 text-violet-600" },
            { bg: "bg-rose-50", border: "border-rose-200", headerBg: "bg-rose-100/50", text: "text-rose-900", count: "bg-rose-200 text-rose-800", hover: "hover:bg-rose-200/50", dragOver: "bg-rose-100/80", addBtn: "hover:bg-rose-200/50 hover:text-rose-700 hover:border-rose-300 text-rose-600" },
          ];
          const theme = columnThemes[colIndex % columnThemes.length];
          
          return (
            <div key={col.id} className={`flex-shrink-0 w-80 flex flex-col rounded-2xl ${theme.bg} border ${theme.border} p-4 shadow-sm`}>
              {/* Column Header */}
              <div className={`mb-3 pb-3 border-b ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm flex items-center gap-2 ${theme.text}`}>
                    {col.title}
                    <span className={`${theme.count} text-xs py-0.5 px-2.5 rounded-full font-bold`}>
                      {col.tasks.length}
                    </span>
                  </h3>
                  <button className={`p-1.5 rounded-lg transition-colors ${theme.hover} text-slate-400 hover:text-slate-600`}>
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
                    className={`flex-1 overflow-y-auto overflow-x-hidden min-h-[150px] rounded-xl transition-all duration-300 no-scrollbar ${
                      snapshot.isDraggingOver ? `${theme.dragOver} ring-2 ring-inset ring-white/50` : "bg-transparent"
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
                              className={`group p-4 rounded-xl border transition-all duration-200 relative mb-3 bg-slate-50/80 backdrop-blur-sm ${
                                snapshot.isDragging 
                                  ? "shadow-xl scale-[1.02] ring-2 ring-indigo-400/30 z-50 rotate-1" 
                                  : "shadow-sm hover:shadow-md hover:bg-slate-50"
                              }`}
                            >
                              {/* Priority & Options */}
                              <div className="flex items-start justify-between mb-3">
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${styles.pill}`}
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
                                    className={`p-1.5 hover:bg-slate-100 rounded-lg transition-all ${styles.icon}`}
                                    title="Add Attachment"
                                  >
                                    {uploadingTaskId === task.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Paperclip className="w-4 h-4" />
                                    )}
                                  </button>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger render={
                                      <button
                                        className={`p-1.5 hover:bg-slate-100 rounded-lg transition-all ${styles.icon}`}
                                        title="Task Options"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                    } />
                                    <DropdownMenuContent 
                                      align="end" 
                                      className="w-44 bg-slate-50/80 backdrop-blur-2xl border border-slate-200/40 shadow-xl shadow-slate-200/20 rounded-xl p-1.5"
                                    >
                                      <DropdownMenuItem 
                                        onClick={() => setTaskToEdit(task)} 
                                        className="rounded-lg p-2.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900 focus:bg-indigo-50 focus:text-indigo-700 transition-colors group"
                                      >
                                        <Edit2 className="w-4 h-4 mr-2 text-slate-400 group-focus:text-indigo-600" />
                                        Edit Task
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => setTaskToDelete({ id: task.id, title: task.title })} 
                                        className="rounded-lg p-2.5 cursor-pointer font-medium text-rose-600 focus:text-rose-700 focus:bg-rose-50 transition-colors group"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2 text-rose-500 group-focus:text-rose-600" />
                                        Delete Task
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                              {/* Title & Description */}
                              <h4 className={`text-sm font-bold leading-snug mb-1.5 ${styles.text}`}>
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
                                      className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-1.5 rounded-lg border border-slate-200/60 shadow-sm transition-colors max-w-full"
                                      title={att.filename}
                                    >
                                      <Paperclip className="w-3 h-3 flex-shrink-0 text-slate-400" />
                                      <span className="truncate max-w-[120px]">{att.filename}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                                <div className={`flex items-center gap-3 ${styles.icon}`}>
                                  {task.comments > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                      </svg>
                                      {task.comments}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center -space-x-1.5">
                                  {task.assignees && task.assignees.length > 0 ? (
                                    task.assignees.map((assignee: any) => (
                                      <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white shadow-sm bg-slate-50" title={assignee.name}>
                                        {assignee.photo && <AvatarImage src={getImageUrl(assignee.photo) as string} />}
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                          {assignee.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))
                                  ) : (
                                    <div className="h-6 w-6 rounded-full border-2 border-white shadow-sm bg-slate-50 flex items-center justify-center border-dashed border-slate-300" title="Unassigned">
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
                    <CreateTaskModal columnId={col.id} members={members} onOptimisticCreate={handleOptimisticCreate}>
                      <button className={`w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold rounded-xl transition-all border border-dashed mt-2 ${theme.addBtn}`}>
                        <Plus className="w-4 h-4" />
                        Add task
                      </button>
                    </CreateTaskModal>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>

      <Dialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <DialogContent className="sm:max-w-md bg-slate-50/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Task
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-500 leading-relaxed">
              Are you sure you want to delete <strong className="font-semibold text-slate-700">"{taskToDelete?.title}"</strong>? This action cannot be undone and will permanently remove the task and its attachments.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={() => setTaskToDelete(null)} 
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if(taskToDelete) handleDeleteTask(taskToDelete.id);
                setTaskToDelete(null);
              }} 
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {taskToEdit && (
        <EditTaskModal 
          task={taskToEdit} 
          columns={columns} 
          members={members} 
          isOpen={true} 
          onClose={() => setTaskToEdit(null)} 
          onOptimisticEdit={handleOptimisticEdit}
        />
      )}
    </DragDropContext>
  );
}
