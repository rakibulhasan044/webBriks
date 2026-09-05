"use client";

import React from "react";
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
import { UserPlus } from "lucide-react";

export function AddMemberModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger render={children as any} />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Invite a Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite to this board.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-medium text-sm">
              Email Address
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="e.g. colleague@example.com" 
              required 
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <UserPlus className="w-4 h-4" />
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
