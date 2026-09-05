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
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assigneeId: z.string().optional(),
  selectedColumnId: z.string().min(1, "Column is required"),
});

type FormErrors = {
  title?: string[];
  description?: string[];
  priority?: string[];
  assigneeId?: string[];
  selectedColumnId?: string[];
};

interface CreateTaskModalProps {
  children: React.ReactNode;
  columnId?: string; 
  columns?: { id: string; title: string }[];
  members?: { id: string; name: string; photo?: string }[];
}

export function CreateTaskModal({ children, columnId, columns = [], members = [] }: CreateTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attachment, setAttachment] = useState<File | null>(null);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      assigneeId: formData.get("assigneeId") as string,
      selectedColumnId: formData.get("column") as string || columnId || "",
    };

    const result = createTaskSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        title: result.data.title,
        description: result.data.description,
        priority: result.data.priority,
      };
      if (result.data.assigneeId) {
        payload.assigneeId = result.data.assigneeId;
      }

      // 1. Create the task
      const res = await taskService.createTask(result.data.selectedColumnId, payload);
      
      if (res.success) {
        // 2. If there's an attachment, upload it to the newly created task
        const taskId = res.data?.id || (res as any).id; // Fallback depending on backend structure
        
        if (taskId && attachment) {
          try {
            await taskService.addAttachment(taskId, attachment);
          } catch (attError) {
            toast.error("Task created, but failed to upload attachment");
          }
        }
        
        toast.success("Task created successfully!");
        setIsOpen(false);
        setAttachment(null);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to create task");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setErrors({});
        setAttachment(null);
      }
    }}>
      <DialogTrigger asChild render={children as any} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your board.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-2">
          <div className="flex flex-col gap-4">
            
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

            {/* Assignee Select */}
            {members.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <Label htmlFor="assigneeId" className="text-sm font-medium">Assignee</Label>
                <select 
                  id="assigneeId" 
                  name="assigneeId"
                  defaultValue=""
                  disabled={isLoading}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                {errors.assigneeId && <p className="text-sm text-red-500">{errors.assigneeId[0]}</p>}
              </div>
            )}

            {/* Attachment Upload */}
            <div className="flex flex-col gap-2 mt-1">
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
                <div className="flex items-center justify-between p-2 border border-slate-200 rounded-md bg-white shadow-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Paperclip className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-700 truncate">{attachment.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    disabled={isLoading}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
          </div>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>} />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
