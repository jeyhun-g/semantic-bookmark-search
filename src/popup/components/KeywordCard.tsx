import React from "react";

interface KeywordCardProps {
  keyword: string
  onClick: () => void
}

export const KeywordCard: React.FC<KeywordCardProps> = ({
  keyword,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-md border border-gray-200 my-1 px-4 py-2 transition-colors hover:bg-gray-100"
    >
      {keyword}
    </div>
  );
};
