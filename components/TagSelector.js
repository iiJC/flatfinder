"use client";

import "../css/globals.scss";
import { useState } from "react";
import { CATEGORIZED_TAGS } from "@/lib/tags";

export default function TagSelector({ selectedTags, setSelectedTags }) {
  const [search, setSearch] = useState("");

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const filterBySearch = (tags) =>
    tags.filter((tag) => tag.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />

      {/* Collapsible categories */}
      {Object.entries(CATEGORIZED_TAGS).map(([category, tags]) => {
        const visibleTags = filterBySearch(tags);
        if (visibleTags.length === 0) return null;

        return (
          <details key={category} className="mb-4" open>
            <summary className="font-semibold cursor-pointer">
              {category}
            </summary>
            <div className="flex flex-wrap gap-2 mt-2">
              {visibleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </details>
        );
      })}

      {/* Selected tag summary with remove buttons */}
      {selectedTags.length > 0 && (
        <div className="pt-4">
          <p className="font-medium mb-2">Selected Tags:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-800 hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
