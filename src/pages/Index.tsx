import { useState } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalSidebar } from "@/components/JournalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { addDays, addMonths, addYears, startOfMonth, startOfYear } from "date-fns";
import { toast } from "sonner";

interface Entry {
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>([
    { 
      date: new Date(), 
      title: "",
      content: "", 
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedLevel, setSelectedLevel] = useState<'year' | 'month' | 'date'>('date');

  const handleContentChange = (newContent: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.date.toDateString() === selectedDate.toDateString()
          ? { ...entry, content: newContent, updatedAt: new Date() }
          : entry
      )
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.date.toDateString() === selectedDate.toDateString()
          ? { ...entry, title: newTitle, updatedAt: new Date() }
          : entry
      )
    );
  };

  const handleAddEntry = () => {
    const lastEntry = entries[entries.length - 1];
    let newDate: Date;

    switch (selectedLevel) {
      case 'year':
        newDate = startOfYear(addYears(lastEntry.date, 1));
        break;
      case 'month':
        newDate = startOfMonth(addMonths(lastEntry.date, 1));
        break;
      default: // 'date'
        newDate = addDays(lastEntry.date, 1);
    }
    
    const entryExists = entries.some(
      entry => entry.date.toDateString() === newDate.toDateString()
    );

    if (!entryExists) {
      const now = new Date();
      const newEntry = { 
        date: newDate, 
        title: "",
        content: "", 
        createdAt: now,
        updatedAt: now
      };
      
      setEntries(prevEntries => [...prevEntries, newEntry]);
      // 新しいエントリーを追加した後、選択状態をリセット
      setSelectedDate(newDate);
      // 選択レベルは変更せず、現在の選択レベルを維持
      toast.success("新しい日記を作成しました");
    } else {
      toast.error("既に存在する日付です");
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
    title: "",
    content: "", 
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-journal-bg">
        <JournalSidebar
          entries={entries}
          onSelectEntry={(entry) => {
            setSelectedDate(entry.date);
          }}
          selectedDate={selectedDate}
          onAddEntry={handleAddEntry}
          onDeleteEntry={handleDeleteEntry}
          onSelectLevel={setSelectedLevel}
          selectedLevel={selectedLevel}
        />
        <main className="flex-1 p-8">
          <JournalEntry
            date={currentEntry.date}
            title={currentEntry.title}
            content={currentEntry.content}
            onContentChange={handleContentChange}
            onTitleChange={handleTitleChange}
            createdAt={currentEntry.createdAt}
            updatedAt={currentEntry.updatedAt}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;