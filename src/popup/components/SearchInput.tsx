import React, { useEffect, useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  debounceDelay?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  debounceDelay = 500,
}) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (input === "") {
      onSearch("");
      return;
    }

    const handler = setTimeout(() => {
      onSearch(input);
    }, debounceDelay);


    return () => clearTimeout(handler);
  }, [input, debounceDelay, onSearch]);

  return (
    <div className="w-full flex flex-row rounded-lg border border-gray-300 px-2 py-2">
      <input
        type="text"
        className="grow-2 outline-0"
        placeholder="Search bookmarks..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      {input && (
        <button
          className="text-gray-400 hover:text-gray-600 hover:cursor-pointer text-md"
          onClick={() => setInput("")}
          aria-label="Clear search"
        >
          X
        </button>
      )}
    </div>
  );
};
