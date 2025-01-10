import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface JournalEntry {
  date: Date;
  content: string;
}

interface JournalSidebarProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  selectedDate: Date;
}

export const JournalSidebar = ({
  entries,
  onSelectEntry,
  selectedDate,
}: JournalSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-journal-border">
        <h2 className="text-lg font-semibold text-journal-text">日記一覧</h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-2 p-4">
          {entries.map((entry) => (
            <Button
              key={entry.date.toISOString()}
              variant="ghost"
              className={`w-full justify-start ${
                format(entry.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                  ? "bg-journal-accent"
                  : ""
              }`}
              onClick={() => onSelectEntry(entry)}
            >
              <span className="text-sm text-journal-text">
                {format(entry.date, "M月d日")}
              </span>
            </Button>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};