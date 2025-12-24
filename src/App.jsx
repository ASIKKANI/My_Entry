import { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { LandingPage } from "@/components/LandingPage"
import { JournalEditor } from "@/components/JournalEditor"
import { MediaGallery } from "@/components/MediaGallery"
import { Dashboard } from "@/components/Dashboard"
import { Onboarding } from "@/components/Onboarding"
import { useJournal } from "@/hooks/useJournal"
import { useUser } from "@/hooks/useUser"
import { ErrorBoundary } from "@/components/ErrorBoundary"

function App() {
    const [view, setView] = useState("landing")
    const { userName, saveUserName } = useUser()
    // Tracks which entry is being edited; null for new entry.
    const [activeEntry, setActiveEntry] = useState(null)

    const { entries, addEntry, updateEntry, deleteEntry, togglePin, toggleLock } = useJournal()

    const handleCreateNew = () => {
        setActiveEntry(null)
        setView("journal")
    }

    const handleEdit = (entry) => {
        setActiveEntry(entry)
        setView("journal")
    }

    const handleSaveEntry = (entryData, shouldExit = true) => {
        if (activeEntry) {
            updateEntry(activeEntry.id, entryData)
        } else {
            const newEntry = addEntry(entryData)
            setActiveEntry(newEntry) // Set active so subsequent auto-saves update instead of create
        }

        if (shouldExit) {
            setView("dashboard")
        }
    }

    // Show onboarding if no user name and we are past the landing page (or check immediately)
    // Actually, let's show onboarding if no name, overlaying everything, or as a dedicated step.
    // Strategy: If !userName, verify if we should intervene. 
    // Let's make it blocking: If !userName, we show onboarding (except maybe initial landing, but simple is better: Blocking).

    return (
        <div className="min-h-screen bg-background overflow-hidden relative">
            <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E')] opacity-40 pointer-events-none z-50 mix-blend-overlay"></div>

            <AnimatePresence>
                {!userName && (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100]"
                    >
                        <Onboarding onComplete={saveUserName} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {view === "landing" && (
                    <motion.div
                        key="landing"
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.5 }}
                    >
                        <LandingPage onStart={(v) => {
                            if (v === "gallery") setView("gallery")
                            else setView("dashboard") // Default flow: Landing -> Dashboard
                        }} />
                    </motion.div>
                )}

                {view === "dashboard" && (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                    >
                        <Dashboard
                            userName={userName}
                            entries={entries}
                            onCreate={handleCreateNew}
                            onEdit={handleEdit}
                            onDelete={deleteEntry}
                            onPin={togglePin}
                            toggleLock={toggleLock}
                            onBack={() => setView("landing")}
                        />
                    </motion.div>
                )}

                {view === "journal" && (
                    <motion.div
                        key="journal"
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <ErrorBoundary>
                            <JournalEditor
                                entry={activeEntry}
                                onBack={() => setView("dashboard")}
                                onSave={handleSaveEntry}
                            />
                        </ErrorBoundary>
                    </motion.div>
                )}

                {view === "gallery" && (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen w-full bg-background"
                    >
                        <MediaGallery onBack={() => setView("landing")} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-4 right-6 z-[9999] pointer-events-none text-muted-foreground/80 text-right">
                <p className="font-sans text-[10px] tracking-widest uppercase opacity-60 mb-1">
                    ver 1.1.1
                </p>
                <p className="font-serif italic text-sm tracking-wide drop-shadow-sm">
                    Designed by Ashik
                </p>
            </div>
        </div>
    )
}

export default App
