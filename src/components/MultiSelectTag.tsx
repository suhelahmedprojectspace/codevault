"use client";
import React, { useState, useMemo } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Tag {
  id?:string;
  name: string;
  logo?: string;
}
interface MultiSelectTagProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
}

const MultiSelectTag: React.FC<MultiSelectTagProps> = ({
  availableTags,
  selectedTags,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTags = useMemo(() => {
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [availableTags, searchTerm]);

  const handleTagChange = (tag: Tag, checked: boolean) => {
    const exists = selectedTags.find((t) => t.name === tag.name);
    const newTags = checked
      ? exists
        ? selectedTags
        : [...selectedTags, tag]
      : selectedTags.filter((t) => t.name !== tag.name);
    onChange(newTags);
  };

  const handleRemoveTag = (tagName: string) => {
    onChange(selectedTags.filter((t) => t.name !== tagName));
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <Input
        type="text"
        placeholder="Search tags..."
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md">
          {selectedTags.map((tag) => {
            //     const tagData = availableTags.find(t => t.name === tag);
            return (
              <span
                key={tag.name}
                className="flex items-center px-3 py-1 text-sm font-medium bg-blue-500 text-white rounded-full"
              >
                {tag.logo && (
                  <Avatar className="h-4 w-4 mr-2">
                    <AvatarImage src={tag.logo} />
                    <AvatarFallback>
                      {tag.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                {tag.name}
                <button
                  onClick={() => handleRemoveTag(tag.name)}
                  className="ml-2 hover:text-blue-200 focus:outline-none"
                  aria-label={`Remove ${tag.name}`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      <ul className="space-y-1 max-h-60 overflow-y-auto">
        {filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <CheckboxItem
              key={tag.name}
              tag={tag.name}
              logo={tag.logo}
              checked={!!selectedTags.find((t) => t.name === tag.name)}
              onCheckedChange={(checked) => handleTagChange(tag, checked)}
            />
          ))
        ) : (
          <li className="p-2 text-gray-500">No matching tags found</li>
        )}
      </ul>
    </div>
  );
};

const CheckboxItem = React.memo(
  ({
    tag,
    logo,
    checked,
    onCheckedChange,
  }: {
    tag: string;
    logo?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <li
      className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer group"
      role="option"
      aria-selected={checked}
    >
      <Checkbox.Root
        id={tag}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border mr-3",
          "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
        )}
      >
        <Checkbox.Indicator>
          <CheckIcon className="h-4 w-4 text-white" />
        </Checkbox.Indicator>
      </Checkbox.Root>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src={logo} alt={tag} />
          <AvatarFallback className="text-xs font-medium">
            {tag.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <label
          htmlFor={tag}
          className="text-sm font-medium text-gray-700 cursor-pointer select-none truncate"
          title={tag}
        >
          {tag}
        </label>
      </div>
    </li>
  ),
);

export default MultiSelectTag;
