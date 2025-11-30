"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface TemplateToolbarProps {
  searchTerm: string;
  categoryFilter: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
}

export function TemplateToolbar({
  searchTerm,
  categoryFilter,
  categories,
  onSearchChange,
  onCategoryFilterChange,
}: TemplateToolbarProps) {
  const router = useRouter();

  return (
    <div className="flex sm:justify-between gap-4 ">
      <div className="flex flex-col gap-4  sm:flex-row sm:items-center ">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 text-xs border-gray-200"
          />
        </div>
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full sm:w-40 h-9 text-xs">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => router.push("/admin/t/new")}
          className="w-full sm:w-auto h-9 text-xs"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Template
        </Button>
      </div>
    </div>
  );
}
