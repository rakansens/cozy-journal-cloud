import { useState } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalSidebar } from "@/components/JournalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { addDays, addMonths, addYears, startOfMonth, startOfYear } from "date-fns";
import { toast } from "sonner";

interface Entry {
  id: string;
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>([
    { 
      id: "1",
      date: new Date(), 
      title: "",
      content: "", 
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedLevel, setSelectedLevel] = useState<'year' | 'month' | 'date'>('date');

  const handleContentChange = (id: string, newContent: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id
          ? { ...entry, content: newContent, updatedAt: new Date() }
          : entry
      )
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id
          ? { ...entry, title: newTitle, updatedAt: new Date() }
          : entry
      )
    );
  };

  const handleAddEntry = () => {
    let newDate: Date;
    let referenceDate = selectedDate;

    switch (selectedLevel) {
      case 'year':
        newDate = startOfYear(addYears(referenceDate, 1));
        break;
      case 'month': {
        newDate = startOfMonth(addMonths(referenceDate, 1));
        
        const monthExists = entries.some(entry => 
          entry.date.getMonth() === newDate.getMonth() &&
          entry.date.getFullYear() === newDate.getFullYear()
        );
        
        if (monthExists) {
          toast.error("既に存在する月です");
          return;
        }
        break;
      }
      default: // 'date'
        newDate = addDays(referenceDate, 1);
        break;
    }
    
    const entryExists = selectedLevel === 'date' 
      ? entries.some(entry => entry.date.toDateString() === newDate.toDateString())
      : false;

    if (!entryExists) {
      const now = new Date();
      const newEntry = { 
        id: crypto.randomUUID(),
        date: newDate, 
        title: "",
        content: "", 
        createdAt: now,
        updatedAt: now
      };
      
      setEntries(prevEntries => [...prevEntries, newEntry]);
      setSelectedDate(newDate);
      toast.success("新しい日記を作成しました");
    } else {
      toast.error("既に存在する日付です");
    }
  };

  const handleAddBox = () => {
    const now = new Date();
    const newEntry = {
      id: crypto.randomUUID(),
      date: selectedDate,
      title: "",
      content: "",
      createdAt: now,
      updatedAt: now
    };
    
    setEntries(prevEntries => [...prevEntries, newEntry]);
    toast.success("新しいボックスを追加しました");
  };

  const handleDeleteEntry = (dateToDelete: Date, id: string) => {
    const entriesForDate = entries.filter(
      entry => entry.date.toDateString() === dateToDelete.toDateString()
    );

    if (entriesForDate.length <= 1) {
      toast.error("最後の日記は削除できません");
      return;
    }

    setEntries((prevEntries) => {
      const newEntries = prevEntries.filter(entry => entry.id !== id);
      return newEntries;
    });
    
    toast.success("日記を削除しました");
  };

  const currentEntries = entries.filter(
    (entry) => entry.date.toDateString() === selectedDate.toDateString()
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleAddBox}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                ボックスを追加
              </button>
            </div>
            {currentEntries.map((entry) => (
              <JournalEntry
                key={entry.id}
                date={entry.date}
                title={entry.title}
                content={entry.content}
                onContentChange={(content) => handleContentChange(entry.id, content)}
                onTitleChange={(title) => handleTitleChange(entry.id, title)}
                createdAt={entry.createdAt}
                updatedAt={entry.updatedAt}
              />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;