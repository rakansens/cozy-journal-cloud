import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface JournalEntry {
  date: Date;
  title: string;
  content: string;
}

interface JournalSidebarProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  selectedDate: Date;
  onAddEntry: () => void;
  onDeleteEntry: (date: Date) => void;
}

export const JournalSidebar = ({
  entries,
  onSelectEntry,
  selectedDate,
  onAddEntry,
  onDeleteEntry,
}: JournalSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-journal-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-journal-text">日記一覧</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAddEntry}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-2 p-4">
          {entries.map((entry) => (
            <div
              key={entry.date.toISOString()}
              className="flex items-center gap-2 group"
            >
              <Button
                variant="ghost"
                className={`flex-1 justify-start ${
                  format(entry.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                    ? "bg-journal-accent"
                    : ""
                }`}
                onClick={() => onSelectEntry(entry)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm text-journal-text">
                    {format(entry.date, "M月d日")}
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
                onClick={() => onDeleteEntry(entry.date)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};