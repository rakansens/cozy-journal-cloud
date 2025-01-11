import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JournalSidebarHeaderProps {
  onAddEntry: () => void;
}

export const JournalSidebarHeader = ({ onAddEntry }: JournalSidebarHeaderProps) => {
  return (
    <div className="p-4 border-b border-journal-border">
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
    </div>
  );
};