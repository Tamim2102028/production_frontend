import React from "react";

export const highlightSearchText = (
  text: string,
  query: string
): React.ReactNode => {
  if (!query.trim() || !text) return text;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b(${escapedQuery})\\b`, "gi");
  let lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <mark
        key={`highlight-${match.index}`}
        className="rounded bg-yellow-200 px-1 font-medium"
      >
        {match[0]}
      </mark>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
};
