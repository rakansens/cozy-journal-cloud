import { useState } from "react";
import { toast } from "sonner";
import { addDays, addMonths, addYears, startOfMonth, startOfYear } from "date-fns";

interface Entry {
  id: string;
  date: Date;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useJournalState = () => {
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: "1",
      date: new Date(),
      title: "",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
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

  return {
    entries,
    selectedDate,
    selectedLevel,
    setSelectedDate,
    setSelectedLevel,
    handleContentChange,
    handleTitleChange,
    handleAddEntry,
    handleAddBox,
    handleDeleteEntry,
  };
};