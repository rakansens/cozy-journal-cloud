import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
}

interface JournalSidebarItemProps {
  entry: JournalEntry;
  isSelected: boolean;
  onSelect: (entry: JournalEntry) => void;
  onDelete: (date: Date, id: string) => void;
}

export const JournalSidebarItem = ({
  entry,
  isSelected,
  onSelect,
  onDelete,
}: JournalSidebarItemProps) => {
  return (
    <div className="flex items-center gap-2 group">
      <Button
        variant="ghost"
        className={`flex-1 justify-start ${
          isSelected ? "bg-journal-accent" : ""
        }`}
        onClick={() => onSelect(entry)}
      >
        <div className="flex flex-col items-start">
          <span className="text-sm text-journal-text">
            {format(entry.date, "d日")}
          </span>
          {entry.title && (
            <span className="text-xs text-journal-muted truncate max-w-[150px]">
              {entry.title}
            </span>
          )}
        </div>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(entry.date, entry.id)}
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};