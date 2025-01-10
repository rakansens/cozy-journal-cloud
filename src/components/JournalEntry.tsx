import { useState } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface JournalEntryProps {
  date: Date;
  content: string;
  onContentChange: (content: string) => void;
}

export const JournalEntry = ({ date, content, onContentChange }: JournalEntryProps) => {
  return (
    <Card className="p-6 bg-journal-bg border border-journal-border">
      <div className="flex items-center gap-2 mb-4 text-journal-text">
        <Calendar className="w-5 h-5 text-journal-muted" />
        <span className="font-medium">{format(date, "MMMM d, yyyy")}</span>
      </div>
      <textarea
        className="w-full min-h-[300px] p-4 bg-transparent border-none focus:outline-none text-journal-text resize-none"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="今日はどんな一日でしたか？"
      />
    </Card>
  );
};