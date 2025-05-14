"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

const DeleteCard = ({
  open,
  onClose,
  onConfirm,
  message = "This action cannot be undone. This will permanently delete the item.",
  title = "Are you absolutely sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  isDestructive = true,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${isDestructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            </div>
          </DialogHeader>

          <DialogDescription className="text-sm text-muted-foreground pl-2">
            {message}
          </DialogDescription>

          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-4 hover:bg-muted/50"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={isDestructive ? "destructive" : "default"}
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {confirmText}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCard;
