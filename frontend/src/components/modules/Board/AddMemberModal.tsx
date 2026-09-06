/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import { boardService } from "@/services/board.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addMemberSchema } from "@/zod/board.validation";

type FormErrors = {
  email?: string[];
};

export function AddMemberModal({ children, boardId }: { children: React.ReactNode, boardId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!boardId) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
    };

    const result = addMemberSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await boardService.addMember(boardId, result.data.email);
      if (res.success) {
        toast.success("Member added successfully!");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to add member");
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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add a Member</DialogTitle>
          <DialogDescription>
            Instantly add a user to this board using their email address. They must already have an account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="email" className="text-sm font-medium">
              User Email <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="e.g. teammate@company.com" 
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500 font-medium">{errors.email[0]}</p>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>} />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
