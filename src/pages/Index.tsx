import { useState } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalSidebar } from "@/components/JournalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { addDays, addMonths, addYears, startOfMonth, startOfYear, endOfMonth } from "date-fns";
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
    let newDate: Date;
    let referenceDate = selectedDate;

    switch (selectedLevel) {
      case 'year':
        newDate = startOfYear(addYears(referenceDate, 1));
        break;
      case 'month': {
        // 選択された月の最終日を取得
        const lastDayOfMonth = endOfMonth(referenceDate);
        // その月の最新のエントリーを探す
        const entriesInMonth = entries.filter(
          entry => entry.date.getMonth() === referenceDate.getMonth() &&
                  entry.date.getFullYear() === referenceDate.getFullYear()
        );
        
        if (entriesInMonth.length > 0) {
          // その月の最新の日付の翌日を設定
          const latestEntry = entriesInMonth.reduce((latest, current) => 
            current.date > latest.date ? current : latest
          );
          newDate = addDays(latestEntry.date, 1);
          
          // もし翌日が次の月になる場合は、新しい月の1日を設定
          if (newDate.getMonth() !== referenceDate.getMonth()) {
            newDate = startOfMonth(addMonths(referenceDate, 1));
          }
        } else {
          // その月のエントリーがない場合は、月の1日を設定
          newDate = startOfMonth(referenceDate);
        }
        break;
      }
      default: // 'date'
        newDate = addDays(referenceDate, 1);
    }
    
    // 日付の重複チェックを選択レベルに応じて行う
    const entryExists = selectedLevel === 'date' 
      ? entries.some(entry => entry.date.toDateString() === newDate.toDateString())
      : false;

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
      setSelectedDate(newDate);
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