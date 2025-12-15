import { useState, useEffect } from "react"

export function useJournal() {
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem("mindful_journal_entries")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("mindful_journal_entries", JSON.stringify(entries))
    }, [entries])

    const addEntry = (entry) => {
        const newEntry = { ...entry, id: Date.now().toString(), createdAt: new Date().toISOString() }
        setEntries(prev => [newEntry, ...prev])
        return newEntry
    }

    const updateEntry = (id, updatedEntry) => {
        setEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...updatedEntry } : entry))
    }

    const togglePin = (id) => {
        setEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, pinned: !entry.pinned } : entry
        ))
    }

    const deleteEntry = (id) => {
        setEntries(prev => prev.filter(entry => entry.id !== id))
    }

    // Sort entries: Pinned first, then by date desc
    const sortedEntries = [...entries].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return { entries: sortedEntries, addEntry, updateEntry, deleteEntry, togglePin }
}
