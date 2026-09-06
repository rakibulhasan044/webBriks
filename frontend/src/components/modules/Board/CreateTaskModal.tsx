"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { taskService } from "@/services/task.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Paperclip, X } from "lucide-react";
import { createTaskSchema } from "@/zod/task.validation";

type FormErrors = {
  title?: string[];
  description?: string[];
  priority?: string[];
  assigneeIds?: string[];
  selectedColumnId?: string[];
};

interface CreateTaskModalProps {
  children: React.ReactNode;
  columnId?: string; 
  columns?: { id: string; title: string }[];
  members?: { id: string; name: string; photo?: string }[];
}

export function CreateTaskModal({ children, columnId, columns = [], members = [], onOptimisticCreate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attachment, setAttachment] = useState<File | null>(null);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image, PDF, DOC, or PPTX.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setAttachment(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleAssignee = (id: string) => {
    setSelectedAssignees(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      assigneeIds: selectedAssignees,
      selectedColumnId: formData.get("column") as string || columnId || "",
    };

    const result = createTaskSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    const payload: any = {
      title: result.data.title,
      description: result.data.description,
      priority: result.data.priority,
    };
    if (result.data.assigneeIds && result.data.assigneeIds.length > 0) {
      payload.assigneeIds = result.data.assigneeIds;
    }

    // Trigger Optimistic UI Update instantly
    if (onOptimisticCreate) {
      onOptimisticCreate(result.data.selectedColumnId, payload);
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("optimisticCreate", { detail: { columnId: result.data.selectedColumnId, payload } }));
    }
    
    // Close modal instantly for a snappy feel!
    setIsOpen(false);
    
    try {
      // 1. Create the task
      const res = await taskService.createTask(result.data.selectedColumnId, payload);
      
      if (res.success) {
        // 2. If there's an attachment, upload it to the newly created task
        const taskId = res.data?.id || (res as any).id; // Fallback depending on backend structure
        
        if (taskId && attachment) {
          try {
            await taskService.addAttachment(taskId, attachment);
          } catch (attError: any) {
            toast.error(attError?.message || "Task created, but failed to upload attachment");
          }
        }
        
        toast.success("Task created successfully!");
        setAttachment(null);
        setSelectedAssignees([]);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to create task");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      router.refresh();
    } finally {
      
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setErrors({});
        setAttachment(null);
        setSelectedAssignees([]);
      }
    }}>
      <DialogTrigger render={children as any} />
      <DialogContent className="sm:max-w-[425px] overflow-hidden no-scrollbar">
        <div className="w-full flex flex-col gap-4 min-w-0 overflow-x-hidden no-scrollbar">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your board.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-2 w-full min-w-0 overflow-x-hidden no-scrollbar">
          <div className="flex flex-col gap-4 w-full min-w-0">
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                name="title"
                placeholder="e.g. Update landing page copy" 
                disabled={isLoading}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <textarea 
                id="description" 
                name="description"
                placeholder="Add some details..." 
                disabled={isLoading}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority Select */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <select 
                  id="priority" 
                  name="priority"
                  defaultValue="MEDIUM"
                  disabled={isLoading}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && <p className="text-sm text-red-500">{errors.priority[0]}</p>}
              </div>

              {/* Column Select */}
              {!columnId && columns.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="column" className="text-sm font-medium">Column <span className="text-red-500">*</span></Label>
                  <select 
                    id="column" 
                    name="column"
                    defaultValue={columns[0]?.id || ""}
                    disabled={isLoading}
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                  >
                    {columns.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  {errors.selectedColumnId && <p className="text-sm text-red-500">{errors.selectedColumnId[0]}</p>}
                </div>
              )}
            </div>

            {/* Multiple Assignees Checkboxes */}
            {members.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <Label className="text-sm font-medium">Assignees</Label>
                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto no-scrollbar p-2 border border-slate-200 rounded-md bg-slate-50/50">
                  {members.map(m => (
                    <label key={m.id} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedAssignees.includes(m.id)}
                        onChange={() => toggleAssignee(m.id)}
                        disabled={isLoading}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">{m.name}</span>
                    </label>
                  ))}
                </div>
                {errors.assigneeIds && <p className="text-sm text-red-500">{errors.assigneeIds[0]}</p>}
              </div>
            )}

            {/* Attachment Upload */}
            <div className="flex flex-col gap-2 mt-1 w-full min-w-0">
              <Label className="text-sm font-medium">Attachment (Optional)</Label>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isLoading}
                accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
              />
              
              {!attachment ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full h-10 border-2 border-dashed border-slate-200 rounded-md text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-slate-50/50"
                >
                  <Paperclip className="w-4 h-4" />
                  Attach a file
                </button>
              ) : (
                <div className="flex items-center justify-between p-2 border border-slate-200 rounded-md bg-slate-50 shadow-sm min-w-0">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                    <Paperclip className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-700 truncate min-w-0">{attachment.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    disabled={isLoading}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
          </div>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>} />
            <Button type="submit" className="" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
