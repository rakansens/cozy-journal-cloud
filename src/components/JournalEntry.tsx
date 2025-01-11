import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface JournalEntryProps {
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
}

export const JournalEntry = ({ 
  date, 
  title,
  content, 
  createdAt, 
  updatedAt, 
  onContentChange,
  onTitleChange
}: JournalEntryProps) => {
  return (
    <Card className="p-6 bg-journal-bg border border-journal-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-journal-text">
          <Calendar className="w-5 h-5 text-journal-muted" />
          <span className="font-medium">{format(date, "MMMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-journal-muted">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>作成: {format(createdAt, "HH:mm")}</span>
          </div>
          {updatedAt.getTime() !== createdAt.getTime() && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>更新: {format(updatedAt, "HH:mm")}</span>
            </div>
          )}
        </div>
      </div>
      <Input
        className="mb-4 text-xl font-medium bg-transparent border-none focus:outline-none text-journal-text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="タイトルを入力"
      />
      <textarea
        className="w-full min-h-[300px] p-4 bg-transparent border-none focus:outline-none text-journal-text resize-none"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="今日はどんな一日でしたか？"
      />
    </Card>
  );
};