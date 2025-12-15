import React from 'react';
import { useJournal } from '../context/JournalContext';
import JournalEntryCard from '../components/journal/JournalEntryCard';
import { Search } from 'lucide-react';

const Entries = () => {
    const { entries } = useJournal();

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Your Journal</h2>
                    <p className="text-muted-foreground">All your memories in one place.</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search entries..."
                        className="w-full bg-surfaceHighlight border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map(entry => (
                    <JournalEntryCard key={entry.id} entry={entry} />
                ))}
                {entries.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground">
                        No entries yet. Start writing!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Entries;
