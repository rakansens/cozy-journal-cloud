import { JournalEntry } from "@/components/JournalEntry";
import { JournalSidebar } from "@/components/JournalSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useJournalState } from "@/hooks/useJournalState";

const Index = () => {
  const {
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
  } = useJournalState();

  const currentEntries = entries
    .filter((entry) => entry.date.toDateString() === selectedDate.toDateString())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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