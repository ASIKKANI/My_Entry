import React from 'react';
import { useJournal } from '../../context/JournalContext';
import JournalEntryCard from '../journal/JournalEntryCard';
import { Sparkles, TrendingUp, Calendar as CalendarIcon, Image as ImageIcon } from 'lucide-react';
import Button from '../ui/Button';

const StatCard = ({ icon: Icon, label, value, trend }) => (
    <div className="glass p-6 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-bold">{value}</h4>
                {trend && <span className="text-xs text-green-400">{trend}</span>}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { entries } = useJournal();

    // Mock data for now if empty
    const displayEntries = entries.length > 0 ? entries : [
        { id: 1, title: 'Welcome to Journal', content: 'Start writing your thoughts...', createdAt: new Date().toISOString(), media: [] }
    ];

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Good Evening, Ashik</h2>
                    <p className="text-muted-foreground">Here's what's happening in your journal.</p>
                </div>
                <Button size="lg" className="shadow-primary/25">
                    <Sparkles className="w-5 h-5" />
                    Write New
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={CalendarIcon} label="Total Entries" value={entries.length} trend="+2 this week" />
                <StatCard icon={ImageIcon} label="Media Captured" value="12" trend="+5 new" />
                <StatCard icon={TrendingUp} label="Streak" value="3 Days" />
            </div>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Recent Memories</h3>
                    <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayEntries.slice(0, 3).map(entry => (
                        <JournalEntryCard key={entry.id} entry={entry} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
