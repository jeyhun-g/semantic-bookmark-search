import React, { useMemo } from "react";
import { Bookmark } from "../../types";
import { Folder, MoveRight } from "lucide-react";

interface BookmarkCardProps {
  bookmark: Bookmark
  onClick: (bookmark: Bookmark) => void
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onClick
}) => {

  const path = useMemo(() => {
    return bookmark.folders.map((folder, i) => {
      if (i === bookmark.folders.length - 1) {
        return <p>{folder}</p>
      }

      return <span className="flex flex-row justify-center items-center mr-1">
        <Folder size={12} className="mr-1" />
        <p>{folder}</p>
        <MoveRight className="ml-1" size={12} />
      </span>
    })
  }, [bookmark])
  return (
    <div
      onClick={() => onClick(bookmark)}
      title={bookmark.url}
      className="cursor-pointer rounded-md border border-gray-200 my-2 px-4 py-2 transition-colors hover:bg-gray-100"
    >
      <div className="font-medium text-sm text-gray-900">{bookmark.title}</div>
      <div className="text-xs mt-1 text-gray-500 truncate">{bookmark.url}</div>
      <div className="flex flex-wrap mt-2 text-gray-500">{path}</div>
      <div>{bookmark.keywords.join(" > ")}</div>
    </div>
  );
};
