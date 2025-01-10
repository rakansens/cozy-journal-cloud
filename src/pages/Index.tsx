import { useState } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalSidebar } from "@/components/JournalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { addDays } from "date-fns";

interface Entry {
  date: Date;
  content: string;
}

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>([
    { date: new Date(), content: "" },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleContentChange = (newContent: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.date.toDateString() === selectedDate.toDateString()
          ? { ...entry, content: newContent }
          : entry
      )
    );
  };

  const handleAddEntry = () => {
    const lastEntry = entries[entries.length - 1];
    const newDate = addDays(lastEntry.date, 1);
    
    // Check if an entry for this date already exists
    const entryExists = entries.some(
      entry => entry.date.toDateString() === newDate.toDateString()
    );

    if (!entryExists) {
      setEntries([...entries, { date: newDate, content: "" }]);
      setSelectedDate(newDate);
    }
  };

  const currentEntry = entries.find(
    (entry) => entry.date.toDateString() === selectedDate.toDateString()
  ) || { date: selectedDate, content: "" };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-journal-bg">
        <JournalSidebar
          entries={entries}
          onSelectEntry={(entry) => setSelectedDate(entry.date)}
          selectedDate={selectedDate}
          onAddEntry={handleAddEntry}
        />
        <main className="flex-1 p-8">
          <JournalEntry
            date={currentEntry.date}
            content={currentEntry.content}
            onContentChange={handleContentChange}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;