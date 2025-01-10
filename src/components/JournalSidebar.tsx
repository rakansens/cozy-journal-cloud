import { format } from "date-fns";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

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
  onSelectLevel: (level: 'year' | 'month' | 'date') => void;
  selectedLevel: 'year' | 'month' | 'date';
}

interface GroupedEntries {
  [year: string]: {
    [month: string]: JournalEntry[];
  };
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

  // エントリーを年と月でグループ化
  const groupedEntries = entries.reduce<GroupedEntries>((acc, entry) => {
    const year = format(entry.date, 'yyyy');
    const month = format(entry.date, 'MM');
    
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    
    acc[year][month].push(entry);
    return acc;
  }, {});

  const toggleYear = (year: string) => {
    setExpandedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths(prev =>
      prev.includes(yearMonth)
        ? prev.filter(m => m !== yearMonth)
        : [...prev, yearMonth]
    );
  };

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
          {Object.entries(groupedEntries)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
            .map(([year, months]) => (
              <Collapsible
                key={year}
                open={expandedYears.includes(year)}
                className="space-y-2"
              >
                <CollapsibleTrigger
                  onClick={() => {
                    toggleYear(year);
                    onSelectLevel('year');
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
                          onClick={() => {
                            toggleMonth(`${year}-${month}`);
                            onSelectLevel('month');
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
                              <div
                                key={entry.date.toISOString()}
                                className="flex items-center gap-2 group"
                              >
                                <Button
                                  variant="ghost"
                                  className={`flex-1 justify-start ${
                                    selectedLevel === 'date' &&
                                    format(entry.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                                      ? "bg-journal-accent"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    onSelectEntry(entry);
                                  }}
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
                                  onClick={() => onDeleteEntry(entry.date)}
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};