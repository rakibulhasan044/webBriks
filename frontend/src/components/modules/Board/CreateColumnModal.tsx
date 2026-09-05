"use client";

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { columnService } from "@/services/column.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";

const createColumnSchema = z.object({
  title: z.enum(["TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE"], {
    errorMap: () => ({ message: "Please select a valid column title" }),
  }),
});

export function CreateColumnModal({ children, boardId }: { children: React.ReactNode, boardId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string[] }>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!boardId) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
    };

    const result = createColumnSchema.safeParse(data);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await columnService.createColumn(boardId, result.data);
      if (res.success) {
        toast.success("Column created successfully!");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to create column");
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
      if (!open) setErrors({});
    }}>
      <DialogTrigger render={children as any} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogDescription>
            Create a new stage for your workflow by selecting an available status. Note that a board can only have one column per title.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="column-title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </Label>
              <select 
                id="column-title" 
                name="title"
                defaultValue=""
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white/50 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select a title...</option>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
              {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>} />
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
