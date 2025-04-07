"use client";

import { useState } from "react";
import { TAG_SUGGESTIONS } from "@/lib/tags";

export default function TagSelector({ selectedTags, setSelectedTags }) {
  const [search, setSearch] = useState("");

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredTags = TAG_SUGGESTIONS.filter((tag) =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Search tags..."
        className="w-full p-2 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full border text-sm ${
              selectedTags.includes(tag)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <div className="pt-2 text-sm text-gray-700">
          <strong>Selected:</strong> {selectedTags.join(", ")}
        </div>
      )}
    </div>
  );
}
