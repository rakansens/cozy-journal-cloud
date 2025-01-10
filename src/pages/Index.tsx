import { useState } from "react";
import { JournalEntry } from "@/components/JournalEntry";
import { JournalSidebar } from "@/components/JournalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { addDays, startOfMonth } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);

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
    setIsCalendarOpen(true);
  };

  const handleMonthSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedMonth(date);
    }
  };

  const handleAddMonth = () => {
    if (selectedMonth) {
      const newDate = startOfMonth(selectedMonth);
      
      const entryExists = entries.some(
        entry => entry.date.toDateString() === newDate.toDateString()
      );

      if (!entryExists) {
        const now = new Date();
        setEntries(prevEntries => [...prevEntries, { 
          date: newDate, 
          title: "",
          content: "", 
          createdAt: now,
          updatedAt: now
        }]);
        setSelectedDate(newDate);
        setIsCalendarOpen(false);
        setSelectedMonth(undefined);
        toast.success("新しい月の日記を作成しました");
      } else {
        toast.error("選択した月の日記は既に存在します");
      }
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
          onSelectEntry={(entry) => setSelectedDate(entry.date)}
          selectedDate={selectedDate}
          onAddEntry={handleAddEntry}
          onDeleteEntry={handleDeleteEntry}
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
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>月を選択</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 p-4">
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={handleMonthSelect}
                disabled={(date) =>
                  entries.some(
                    entry => entry.date.toDateString() === startOfMonth(date).toDateString()
                  )
                }
              />
              <div className="flex gap-2">
                <Button onClick={handleAddMonth} disabled={!selectedMonth}>
                  追加
                </Button>
                <Button variant="outline" onClick={() => setIsCalendarOpen(false)}>
                  キャンセル
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Index;