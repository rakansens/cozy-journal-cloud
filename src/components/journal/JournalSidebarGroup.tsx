import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { JournalSidebarItem } from "./JournalSidebarItem";
import { format } from "date-fns";
import { JournalEntry } from "@/utils/journalEntries";

interface JournalSidebarGroupProps {
  year: string;
  months: { [month: string]: JournalEntry[] };
  expandedYears: string[];
  expandedMonths: string[];
  selectedDate: Date;
  selectedLevel: 'year' | 'month' | 'date';
  onToggleYear: (year: string) => void;
  onToggleMonth: (yearMonth: string) => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (date: Date, id: string) => void;
}

export const JournalSidebarGroup = ({
  year,
  months,
  expandedYears,
  expandedMonths,
  selectedDate,
  selectedLevel,
  onToggleYear,
  onToggleMonth,
  onSelectEntry,
  onDeleteEntry,
}: JournalSidebarGroupProps) => {
  return (
    <Collapsible
      open={expandedYears.includes(year)}
      className="space-y-2"
    >
      <CollapsibleTrigger
        onClick={(e) => {
          e.preventDefault();
          onToggleYear(year);
        }}
        className={`flex items-center w-full p-2 hover:bg-journal-accent rounded-md ${
          selectedLevel === 'year' && format(selectedDate, 'yyyy') === year
            ? "bg-journal-accent"
            : ""
        }`}
      >
        {expandedYears.includes(year) ? (
          <ChevronDown className="h-4 w-4 mr-1" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-1" />
        )}
        <span className="text-sm font-medium">{year}年</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 ml-2">
        {Object.entries(months)
          .sort(([monthA], [monthB]) => Number(monthB) - Number(monthA))
          .map(([month, monthEntries]) => (
            <Collapsible
              key={`${year}-${month}`}
              open={expandedMonths.includes(`${year}-${month}`)}
              className="space-y-2"
            >
              <CollapsibleTrigger
                onClick={(e) => {
                  e.preventDefault();
                  onToggleMonth(`${year}-${month}`);
                }}
                className={`flex items-center w-full p-2 hover:bg-journal-accent rounded-md ${
                  selectedLevel === 'month' && 
                  format(selectedDate, 'yyyy-MM') === `${year}-${month}`
                    ? "bg-journal-accent"
                    : ""
                }`}
              >
                {expandedMonths.includes(`${year}-${month}`) ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm">{Number(month)}月</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 ml-4">
                {monthEntries
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((entry) => (
                    <JournalSidebarItem
                      key={entry.id}
                      entry={entry}
                      isSelected={
                        selectedLevel === 'date' &&
                        format(entry.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                      }
                      onSelect={(entry) => {
                        onSelectEntry(entry);
                      }}
                      onDelete={onDeleteEntry}
                    />
                  ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};