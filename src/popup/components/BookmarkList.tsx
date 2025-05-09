import React, { useCallback } from "react";
import { Bookmark } from "../../types";
import { BookmarkCard } from "./BookmarkCard";

interface BookmarkListProps {
  bookmarks: Bookmark[]
}

export const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks
}) => {
  const openBookmark = useCallback((b: Bookmark) => {
    chrome.tabs.create({ url: b.url, active: false });
  }, []);


  if (bookmarks.length === 0) {
    return (
      <div className="w-full flex grow justify-center">
        <p className="justify-center self-center">No bookmarks found</p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <p>Bookmarks found: {bookmarks.length}</p>
      {bookmarks.map((b) => <BookmarkCard bookmark={b} onClick={openBookmark} />)}
    </div>
  )
};
