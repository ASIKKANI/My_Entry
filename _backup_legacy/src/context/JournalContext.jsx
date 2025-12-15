import React, { createContext, useContext, useState, useEffect } from 'react';

const JournalContext = createContext();

export const useJournal = () => {
    const context = useContext(JournalContext);
    if (!context) {
        throw new Error('useJournal must be used within a JournalProvider');
    }
    return context;
};

export const JournalProvider = ({ children }) => {
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('journal_entries');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('journal_entries', JSON.stringify(entries));
    }, [entries]);

    const addEntry = (entry) => {
        const newEntry = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...entry,
        };
        setEntries([newEntry, ...entries]);
    };

    const updateEntry = (id, updatedFields) => {
        setEntries(entries.map(entry =>
            entry.id === id ? { ...entry, ...updatedFields, updatedAt: new Date().toISOString() } : entry
        ));
    };

    const deleteEntry = (id) => {
        setEntries(entries.filter(entry => entry.id !== id));
    };

    return (
        <JournalContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
            {children}
        </JournalContext.Provider>
    );
};
