import { useState } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalSidebar } from "@/components/JournalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { addDays } from "date-fns";
import { toast } from "sonner";

interface Entry {
  date: Date;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>([
    { 
      date: new Date(), 
      content: "", 
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleContentChange = (newContent: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.date.toDateString() === selectedDate.toDateString()
          ? { ...entry, content: newContent, updatedAt: new Date() }
          : entry
      )
    );
  };

  const handleAddEntry = () => {
    const lastEntry = entries[entries.length - 1];
    const newDate = addDays(lastEntry.date, 1);
    
    const entryExists = entries.some(
      entry => entry.date.toDateString() === newDate.toDateString()
    );

    if (!entryExists) {
      const now = new Date();
      setEntries([...entries, { 
        date: newDate, 
        content: "", 
        createdAt: now,
        updatedAt: now
      }]);
      setSelectedDate(newDate);
      toast.success("新しい日記を作成しました");
    }
  };

  const handleDeleteEntry = (dateToDelete: Date) => {
    if (entries.length <= 1) {
      toast.error("最後の日記は削除できません");
      return;
    }

    setEntries((prevEntries) => {
      const newEntries = prevEntries.filter(
        (entry) => entry.date.toDateString() !== dateToDelete.toDateString()
      );
      
      // If we're deleting the currently selected entry, select the last entry
      if (dateToDelete.toDateString() === selectedDate.toDateString()) {
        setSelectedDate(newEntries[newEntries.length - 1].date);
      }
      
      return newEntries;
    });
    
    toast.success("日記を削除しました");
  };

  const currentEntry = entries.find(
    (entry) => entry.date.toDateString() === selectedDate.toDateString()
  ) || { 
    date: selectedDate, 
    content: "", 
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-journal-bg">
        <JournalSidebar
          entries={entries}
          onSelectEntry={(entry) => setSelectedDate(entry.date)}
          selectedDate={selectedDate}
          onAddEntry={handleAddEntry}
          onDeleteEntry={handleDeleteEntry}
        />
        <main className="flex-1 p-8">
          <JournalEntry
            date={currentEntry.date}
            content={currentEntry.content}
            onContentChange={handleContentChange}
            createdAt={currentEntry.createdAt}
            updatedAt={currentEntry.updatedAt}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;