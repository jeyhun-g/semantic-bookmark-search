import React from "react";
import { Bookmark } from "../../types";

interface BookmarkCardProps {
  bookmark: Bookmark
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark
}) => {
  const openBookmark = () => {
    chrome.tabs.create({ url: bookmark.url, active: false });
  };

  return (
    <div
      onClick={openBookmark}
      title={bookmark.url}
      className="cursor-pointer rounded-md border border-gray-200 my-2 px-4 py-2 transition-colors hover:bg-gray-100"
    >
      <div className="font-medium text-sm text-gray-900">{bookmark.title}</div>
      <div className="text-xs text-gray-500 truncate">{bookmark.url}</div>
      <div className="text-xs text-gray-500 truncate">{"folder-path"}</div>
    </div>
  );
};
