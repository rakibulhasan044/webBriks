"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ImageIcon,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { boardService } from "@/services/board.service";
import { toast } from "sonner";
import { revalidateBoardsPage } from "@/app/(dashboardlayout)/dashboard/boards/_actions";
import { getImageUrl } from "@/lib/utils";
import { editBoardSchema } from "@/zod/board.validation";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    getImageUrl(board.coverImage) as string | null,
  );
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

      const validationResult = editBoardSchema.safeParse({
        title,
        description,
      });

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
        <DropdownMenuTrigger
          render={
            <button
              className="p-2 rounded-xl bg-slate-50/70 backdrop-blur-xl hover:bg-slate-50 text-slate-600 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200/50 hover:border-slate-300/80 hover:-translate-y-0.5"
              aria-label="Board Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
        />
        <DropdownMenuContent
          align="end"
          className="w-52 bg-slate-50/80 backdrop-blur-2xl border border-slate-200/40 shadow-xl shadow-slate-200/20 rounded-xl p-1.5"
        >
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/boards/${board.id}`)}
            className="rounded-lg cursor-pointer focus:bg-sky-50 focus:text-sky-700"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center mr-2.5">
              <Eye className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <span className="text-sm font-medium">View Board</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
            className="rounded-lg cursor-pointer focus:bg-amber-50 focus:text-amber-700"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center mr-2.5">
              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-sm font-medium">Edit Board</span>
          </DropdownMenuItem>
          <div className="h-px bg-slate-100 my-1" />
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="rounded-lg cursor-pointer focus:bg-rose-50 focus:text-rose-700"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center mr-2.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <span className="text-sm font-medium text-rose-600">
              Delete Board
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EDIT MODAL */}
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setTimeout(() => {
              setErrors({});
              setPreviewUrl(getImageUrl(board.coverImage) as string | null);
            }, 300);
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px] bg-slate-50/95 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-slate-200/30 rounded-2xl p-0 overflow-hidden">
          {/* Header with subtle gradient accent */}
          <div className="bg-gradient-to-r from-indigo-50/80 via-violet-50/60 to-fuchsia-50/40 px-6 pt-6 pb-4 border-b border-slate-100">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Edit2 className="w-4 h-4 text-indigo-600" />
                </div>
                Edit Board
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 pl-10">
                Update your board&apos;s details and cover image.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleEditSubmit} className="px-6 py-5">
            <div className="grid gap-5">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="title"
                  className="text-right text-[13px] font-semibold text-slate-700 pt-2.5"
                >
                  Title <span className="text-rose-500">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="title"
                    name="title"
                    defaultValue={board.title}
                    placeholder="e.g. Marketing Campaign"
                    className={`rounded-xl border-slate-200 bg-slate-50/50 focus:bg-slate-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all ${
                      errors.title
                        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                        : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-400" />
                      {errors.title[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="description"
                  className="text-right text-[13px] font-semibold text-slate-700 pt-2.5"
                >
                  Description
                </Label>
                <div className="col-span-3">
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={board.description || ""}
                    placeholder="Add some details about this board..."
                    className={`flex min-h-[90px] w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:bg-slate-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus-visible:outline-none transition-all resize-none ${
                      errors.description
                        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                        : "border-slate-200"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-400" />
                      {errors.description[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label
                  htmlFor="coverImage"
                  className="text-right text-[13px] font-semibold text-slate-700 pt-2.5"
                >
                  Cover Image
                </Label>
                <div className="col-span-3">
                  <label
                    htmlFor="coverImage"
                    className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-300/60 transition-all duration-300 overflow-hidden group"
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="text-white text-sm font-semibold flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Change Image
                          </span>
                        </div>
                        <button
                          onClick={clearImage}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-rose-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-rose-600 transition-colors z-10 shadow-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                          <ImageIcon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">
                          Click to upload an image
                        </p>
                        <p className="text-[11px] mt-1 text-slate-400 font-medium">
                          PNG, JPG or WEBP (Max 5MB)
                        </p>
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

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isLoading}
                className="rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50 transition-all"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[420px] bg-slate-50/95 backdrop-blur-2xl border border-rose-200/40 shadow-2xl shadow-rose-100/30 rounded-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-rose-50 to-orange-50/30 px-6 pt-6 pb-4 border-b border-rose-100/50">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-bold text-rose-700 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                Delete Board
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-slate-800 font-semibold">
                {board.title}
              </strong>
              ? This action cannot be undone and will permanently delete all
              columns and tasks inside this board.
            </p>

            <div className="mt-4 p-3 rounded-lg bg-rose-50/50 border border-rose-100/60">
              <p className="text-xs text-rose-600 font-medium flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                This will delete {board.columns?.length || 0} columns and all
                associated tasks.
              </p>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isLoading}
              className="rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200/50 hover:shadow-rose-300/50 transition-all"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
