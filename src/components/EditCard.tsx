"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
// import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns";

interface Props {
  open: boolean;
  onClose: () => void;
  type: string;
  data: any;
  onSave: (type: string, newData: any) => void;
}

export default function EditCard({ open, onClose, type, data, onSave }: Props) {
  const [editedData, setEditedData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  // Handle simple field changes
  const handleSimpleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditedData(e.target.value);
  };

  // Handle experience field changes
  const handleExperienceChange = (field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await onSave(type, editedData);
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Field-specific configuration
  const renderField = () => {
    switch (type) {
      case "name":
      case "title":
      case "education":
      case "yearofexperience":
      case "location":
        return (
          <Input
            value={editedData}
            onChange={handleSimpleChange}
            className="text-lg"
          />
        );

      case "summary":
        return (
          <Textarea
            value={editedData}
            onChange={handleSimpleChange}
            className="min-h-[200px] text-lg"
          />
        );

      case "experience":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Job Title
              </label>
              <Input
                value={editedData.role}
                onChange={(e) => handleExperienceChange("role", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Company
              </label>
              <Input
                value={editedData.company}
                onChange={(e) =>
                  handleExperienceChange("company", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={editedData.startDate}
                  onChange={(e) =>
                    handleExperienceChange("startDate", e.target.value)
                  }
                />
              </div>

              {!editedData.currentlyWorking && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={editedData.endDate}
                    onChange={(e) =>
                      handleExperienceChange("endDate", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="currentlyWorking"
                checked={editedData.currentlyWorking}
                onChange={(e) =>
                  handleExperienceChange("currentlyWorking", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="currentlyWorking"
                className="text-sm text-gray-400"
              >
                I currently work here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <Textarea
                value={editedData.description}
                onChange={(e) =>
                  handleExperienceChange("description", e.target.value)
                }
                className="min-h-[150px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Technologies Used
              </label>
              <Input
                value={editedData.techTag?.join(", ") || ""}
                onChange={(e) =>
                  handleExperienceChange(
                    "techTag",
                    e.target.value.split(",").map((t: string) => t.trim()),
                  )
                }
                placeholder="React, Node.js, TypeScript"
              />
            </div>
          </div>
        );

      default:
        return <Input value={editedData} onChange={handleSimpleChange} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Edit {type.charAt(0).toUpperCase() + type.slice(1)}
            </DialogTitle>
            <DialogDescription>
              Make changes to your {type} here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">{renderField()}</div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
