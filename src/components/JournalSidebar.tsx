import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { format } from "date-fns";
import { JournalSidebarHeader } from "./journal/JournalSidebarHeader";
import { JournalSidebarGroup } from "./journal/JournalSidebarGroup";
import { groupEntriesByDate, type JournalEntry } from "@/utils/journalEntries";

interface JournalSidebarProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  selectedDate: Date;
  onAddEntry: () => void;
  onDeleteEntry: (date: Date, id: string) => void;
  onSelectLevel: (level: 'year' | 'month' | 'date') => void;
  selectedLevel: 'year' | 'month' | 'date';
}

export const JournalSidebar = ({
  entries,
  onSelectEntry,
  selectedDate,
  onAddEntry,
  onDeleteEntry,
  onSelectLevel,
  selectedLevel,
}: JournalSidebarProps) => {
  const [expandedYears, setExpandedYears] = useState<string[]>([format(new Date(), 'yyyy')]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([format(new Date(), 'yyyy-MM')]);

  const groupedEntries = groupEntriesByDate(entries);

  const toggleYear = (year: string) => {
    setExpandedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
    onSelectLevel('year');
  };

  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths(prev =>
      prev.includes(yearMonth)
        ? prev.filter(m => m !== yearMonth)
        : [...prev, yearMonth]
    );
    onSelectLevel('month');
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-journal-border">
        <JournalSidebarHeader onAddEntry={onAddEntry} />
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-2 p-4">
          {Object.entries(groupedEntries)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
            .map(([year, months]) => (
              <JournalSidebarGroup
                key={year}
                year={year}
                months={months}
                expandedYears={expandedYears}
                expandedMonths={expandedMonths}
                selectedDate={selectedDate}
                selectedLevel={selectedLevel}
                onToggleYear={toggleYear}
                onToggleMonth={toggleMonth}
                onSelectEntry={(entry) => {
                  onSelectEntry(entry);
                  onSelectLevel('date');
                }}
                onDeleteEntry={onDeleteEntry}
              />
            ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};