import { format } from "date-fns";

export interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
}

export interface GroupedEntries {
  [year: string]: {
    [month: string]: JournalEntry[];
  };
}

export const groupEntriesByDate = (entries: JournalEntry[]): GroupedEntries => {
  return entries.reduce<GroupedEntries>((acc, entry) => {
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
};