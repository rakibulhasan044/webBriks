"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoreHorizontal, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateTaskModal } from "./CreateTaskModal";
import { CreateColumnModal } from "./CreateColumnModal";

export default function BoardCanvas({ initialColumns, priorityStyles }: any) {
  const [columns, setColumns] = useState(initialColumns);

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

    const newColumns = [...columns];
    const sourceCol = newColumns[sourceColIndex];
    const destCol = newColumns[destColIndex];

    const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    destCol.tasks.splice(destination.index, 0, movedTask);

    setColumns(newColumns);
    
    // Here we would emit to WebSocket and call API to persist
    // console.log("Emitting move event...", { taskId: movedTask.id, colId: destCol.id, index: destination.index });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full items-start">
        {columns.map((col: any) => (
          <div
            key={col.id}
            className={`flex-shrink-0 w-80 flex flex-col max-h-full bg-white rounded-xl shadow-sm border-t-[3px] border-l border-r border-b border-slate-200 ${col.color}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-700 text-sm">
                  {col.title}
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {col.tasks.length}
                </span>
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Column Cards Container (Droppable) */}
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 overflow-y-auto min-h-[150px] space-y-3 p-3 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {col.tasks.map((task: any, index: number) => {
                    const styles =
                      priorityStyles[task.priority as keyof typeof priorityStyles] || priorityStyles["Medium"];
                    
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
                            className={`group p-4 rounded-xl border transition-all relative ${
                              styles.cardBg
                            } ${snapshot.isDragging ? "shadow-lg scale-[1.02] ring-2 ring-indigo-500/20" : "shadow-sm hover:shadow-md"}`}
                          >
                            {/* Priority & Options */}
                            <div className="flex items-start justify-between mb-3">
                              <span
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${styles.pill}`}
                              >
                                {task.priority}
                              </span>
                              <button
                                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-black/5 rounded transition-all ${styles.icon}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Title */}
                            <h4
                              className={`text-sm font-semibold leading-snug mb-4 ${styles.text}`}
                            >
                              {task.title}
                            </h4>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-auto">
                              <div
                                className={`flex items-center gap-3 ${styles.icon}`}
                              >
                                {task.comments > 0 && (
                                  <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      />
                                    </svg>
                                    {task.comments}
                                  </div>
                                )}
                                {task.attachments > 0 && (
                                  <div className="flex items-center gap-1.5 text-xs font-medium">
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                      />
                                    </svg>
                                    {task.attachments}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center -space-x-1.5">
                                <Avatar className="h-6 w-6 border-2 border-white shadow-sm bg-white">
                                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                    U1
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  
                  {/* Add Task Button */}
                  <CreateTaskModal columnId={col.id}>
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
            <button className="w-full h-12 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 bg-white/50 hover:bg-white border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-sm hover:shadow">
              <Plus className="w-4 h-4" />
              Add new column
            </button>
          </CreateColumnModal>
        </div>

      </div>
    </DragDropContext>
  );
}
