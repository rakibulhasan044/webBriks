"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit2, Trash2, Eye, ImageIcon, Loader2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { boardService } from "@/services/board.service";
import { toast } from "sonner";
import { revalidateBoardsPage } from "@/app/(dashboardlayout)/dashboard/boards/_actions";
import { getImageUrl } from "@/lib/utils";
import { z } from "zod";

const editBoardSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title cannot exceed 50 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

type FormErrors = {
  title?: string[];
  description?: string[];
};

export function BoardCardMenu({ board }: { board: any }) {
  const router = useRouter();
  
  // States for modals
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit Form States
  const [previewUrl, setPreviewUrl] = useState<string | null>(getImageUrl(board.coverImage) as string | null);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData(e.currentTarget);
      
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;

      const validationResult = editBoardSchema.safeParse({ title, description });

      if (!validationResult.success) {
        setErrors(validationResult.error.flatten().fieldErrors);
        setIsLoading(false);
        return;
      }
      
      const res = await boardService.updateBoard(board.id, formData);
      
      if (res.success) {
        toast.success("Board updated successfully!");
        setIsEditOpen(false);
        await revalidateBoardsPage();
      } else {
        toast.error(res.message || "Failed to update board");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await boardService.deleteBoard(board.id);
      if (res.success) {
        toast.success("Board deleted successfully!");
        setIsDeleteOpen(false);
        await revalidateBoardsPage();
      } else {
        toast.error(res.message || "Failed to delete board");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1.5 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 shadow-sm transition-all border border-white/20" aria-label="Board Options">
            <MoreVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white/30 backdrop-blur-xl border border-slate-200/40 shadow-xl">
          <DropdownMenuItem onClick={() => router.push(`/dashboard/boards/${board.id}`)}>
            <Eye className="w-4 h-4 mr-2 text-slate-500" />
            View Board
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2 text-slate-500" />
            Edit Board
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        if (!open) {
          setTimeout(() => {
             setErrors({});
             setPreviewUrl(getImageUrl(board.coverImage) as string | null);
          }, 300);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>Update your board's details and cover image.</DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="title" className="text-right text-sm font-medium pt-2">
                  Title <span className="text-red-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input 
                    id="title" 
                    name="title" 
                    defaultValue={board.title}
                    placeholder="e.g. Marketing Campaign" 
                    className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.title[0]}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right text-sm font-medium pt-2">
                  Description
                </Label>
                <div className="col-span-3">
                  <textarea 
                    id="description" 
                    name="description"
                    defaultValue={board.description || ""}
                    placeholder="Add some details about this board..." 
                    className={`flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.description ? "border-red-500 focus-visible:ring-red-500" : "border-slate-200"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.description[0]}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="coverImage" className="text-right text-sm font-medium pt-2">
                  Cover Image
                </Label>
                <div className="col-span-3">
                  <label 
                    htmlFor="coverImage" 
                    className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden group"
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Change Image</span>
                        </div>
                        <button 
                          onClick={clearImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                        <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="text-xs font-semibold">Click to upload an image</p>
                        <p className="text-[10px] mt-1 text-slate-400">PNG, JPG or WEBP (Max 5MB)</p>
                      </div>
                    )}
                    <input 
                      ref={fileInputRef}
                      id="coverImage" 
                      name="coverImage" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isLoading}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Board</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{board.title}</strong>? This action cannot be undone and will delete all columns and tasks inside this board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
