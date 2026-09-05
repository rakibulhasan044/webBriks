"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { editTaskSchema } from "@/zod/task.validation";

type FormErrors = {
  title?: string[];
  description?: string[];
  priority?: string[];
  assigneeIds?: string[];
  selectedColumnId?: string[];
};

interface EditTaskModalProps {
  task: any; 
  columns?: { id: string; title: string }[];
  members?: { id: string; name: string; photo?: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function EditTaskModal({ task, columns = [], members = [], isOpen, onClose }: EditTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [attachment, setAttachment] = useState<File | null>(null);
  
  // Set initial state from task data
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [priority, setPriority] = useState<string>(task?.priority || "MEDIUM");
  const [columnId, setColumnId] = useState<string>(task?.columnId || "");
  const [existingAttachments, setExistingAttachments] = useState<any[]>(task?.attachments || []);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState<string[]>([]);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (isOpen && task) {
      setSelectedAssignees(task.assignees?.map((a: any) => a.id) || []);
      setPriority(task.priority || "MEDIUM");
      setColumnId(task.columnId || "");
      setExistingAttachments(task.attachments || []);
      setAttachmentsToDelete([]);
      setAttachment(null);
      setErrors({});
    }
  }, [isOpen, task]);

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

  const handleStageAttachmentDeletion = (attachmentId: string) => {
    setAttachmentsToDelete(prev => [...prev, attachmentId]);
    setExistingAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) return;
    setErrors({});
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
      assigneeIds: selectedAssignees,
      selectedColumnId: formData.get("column") as string || task.columnId || "",
    };

    const result = editTaskSchema.safeParse(data);

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
        columnId: result.data.selectedColumnId,
      };
      if (result.data.assigneeIds && result.data.assigneeIds.length > 0) {
        payload.assigneeIds = result.data.assigneeIds;
      }

      // 1. Update the task
      const res = await taskService.updateTask(task.id, payload);
      
      if (res.success) {
        // 2. Process staged attachment deletions
        if (attachmentsToDelete.length > 0) {
          try {
            await Promise.all(
              attachmentsToDelete.map(id => taskService.deleteAttachment(task.id, id))
            );
          } catch (delError: any) {
            console.error("Failed to delete some attachments", delError);
            toast.error("Task updated, but failed to delete some attachments");
          }
        }

        // 3. If there's a new attachment, upload it to the task
        if (task.id && attachment) {
          try {
            await taskService.addAttachment(task.id, attachment);
          } catch (attError: any) {
            toast.error(attError?.message || "Task updated, but failed to upload attachment");
          }
        }
        
        toast.success("Task updated successfully!");
        onClose();
        setAttachment(null);
        setSelectedAssignees(task.assignees?.map((a: any) => a.id) || []);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to edit task");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setErrors({});
        setAttachment(null);
        setSelectedAssignees(task?.assignees?.map((a: any) => a.id) || []);
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden no-scrollbar">
        <div className="w-full flex flex-col gap-4 min-w-0 overflow-x-hidden no-scrollbar">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the details of your task.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-2 w-full min-w-0 overflow-x-hidden no-scrollbar">
          <div className="flex flex-col gap-4 w-full min-w-0">
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                name="title"
                defaultValue={task?.title}
                placeholder="e.g. Update landing page copy" 
                disabled={isLoading}
              />
              {errors.title && <p className="text-xs text-red-500">{errors.title[0]}</p>}
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <textarea 
                id="description" 
                name="description"
                defaultValue={task?.description}
                placeholder="Add more details about this task..." 
                disabled={isLoading}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Priority Select */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <select 
                  id="priority" 
                  name="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && <p className="text-xs text-red-500">{errors.priority[0]}</p>}
              </div>

              {/* Column Select */}
              {columns && columns.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="column" className="text-sm font-medium">Column</Label>
                  <select 
                    id="column" 
                    name="column"
                    value={columnId}
                    onChange={(e) => setColumnId(e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {columns.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  {errors.selectedColumnId && <p className="text-xs text-red-500">{errors.selectedColumnId[0]}</p>}
                </div>
              )}
            </div>

            {/* Multiple Assignees Checkboxes */}
            {members.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <Label className="text-sm font-medium">Assignees</Label>
                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto no-scrollbar p-2 border border-slate-200 rounded-md bg-white/50">
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
              <Label className="text-sm font-medium">Attachments</Label>

              {/* Existing Attachments */}
              {existingAttachments.length > 0 && (
                <div className="flex flex-col gap-2 mb-2 w-full min-w-0">
                  {existingAttachments.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-2 border border-slate-200 rounded-md bg-slate-50 shadow-sm min-w-0">
                      <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                        <Paperclip className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <a href={att.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 hover:underline truncate min-w-0">
                          {att.filename}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStageAttachmentDeletion(att.id)}
                        disabled={isLoading}
                        className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Attachment (Only if total < 3) */}
              {existingAttachments.length + (attachment ? 1 : 0) < 3 && (
                <>
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
                      Attach a new file
                    </button>
                  ) : (
                    <div className="flex items-center justify-between p-2 border border-slate-200 rounded-md bg-white shadow-sm border-indigo-100 min-w-0">
                      <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
                        <Paperclip className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-slate-700 truncate min-w-0">{attachment.name}</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium flex-shrink-0">New</span>
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
                </>
              )}
              {existingAttachments.length + (attachment ? 1 : 0) >= 3 && !attachment && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  Maximum of 3 attachments reached.
                </p>
              )}
            </div>
            
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Edit Task
            </Button>
          </DialogFooter>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
