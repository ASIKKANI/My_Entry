import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Plus, Clock, Trash2, ArrowLeft, MoreHorizontal, Palette, Pin } from "lucide-react"
import { cn } from "@/lib/utils"

// Reuse MOODS constant or define local (better shared, but defining local for now to keep simple)
const BG_OPTIONS = [
    { id: "default", label: "Default", color: "" }, // Default is transparent/css var
    { id: "calm", label: "Calm", color: "bg-[#BBDEFB]" },
    { id: "joy", label: "Joy", color: "bg-[#FFE0B2]" },
    { id: "focus", label: "Focus", color: "bg-[#E1BEE7]" },
    { id: "nature", label: "Nature", color: "bg-[#C8E6C9]" },
]

export function Dashboard({ userName, entries, onCreate, onEdit, onDelete, onPin, onBack }) {
    const [bgColor, setBgColor] = useState(() => localStorage.getItem("mindful_dashboard_bg") || "")
    const [customBg, setCustomBg] = useState(() => localStorage.getItem("mindful_dashboard_custom_bg") || "")
    const [isPaletteOpen, setIsPaletteOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem("mindful_dashboard_bg", bgColor)
        localStorage.setItem("mindful_dashboard_custom_bg", customBg)
    }, [bgColor, customBg])

    const handleSelectBg = (id) => {
        setBgColor(id)
        setCustomBg("")
        setIsPaletteOpen(false)
    }

    const handleCustomBgChange = (e) => {
        setCustomBg(e.target.value)
        setBgColor("custom")
        // Don't close on pick to allow adjustment
    }

    const activeBgClass = BG_OPTIONS.find(b => b.id === bgColor)?.color || ""
    const activeStyle = bgColor === "custom" && customBg ? { backgroundColor: customBg } : {}

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        })
    }

    const getMoodStyle = (moodId) => {
        // ... existing getMoodStyle logic kept simple or reused if needed
        switch (moodId) {
            case "calm": return "bg-[#E3F2FD]";
            case "joy": return "bg-[#FFF3E0]";
            case "focus": return "bg-[#F3E5F5]"
            case "nature": return "bg-[#E8F5E9]";
            default: return "bg-white";
        }
    }

    return (
        <motion.div
            className={cn("min-h-screen p-6 md:p-12 transition-colors duration-500", activeBgClass)}
            style={activeStyle}
        >
            <header className="flex items-end justify-between mb-16 border-b border-black/5 pb-6 relative z-10">
                <div>
                    <h2 className="text-5xl md:text-6xl font-serif font-medium text-primary mb-2">
                        {userName ? `${userName}'s Entry` : "My Entry"}
                    </h2>
                    <p className="text-muted-foreground font-sans text-lg">
                        {entries.length} {entries.length === 1 ? 'entry' : 'entries'} written
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Dashboard Palette Toggle */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                            className="rounded-full w-12 h-12 shadow-sm bg-white/50 hover:bg-white/80 backdrop-blur-md transition-all hover:scale-105"
                            title="Page Background"
                        >
                            <Palette className="h-6 w-6 text-primary/80" />
                        </Button>

                        <AnimatePresence>
                            {isPaletteOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10, x: -50 }}
                                    animate={{ opacity: 1, scale: 1, y: 20, x: -100 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute top-full right-0 mt-2 flex items-center gap-3 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/50 min-w-max z-50 origin-top-right"
                                >
                                    {BG_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelectBg(opt.id)}
                                            className={cn(
                                                "w-8 h-8 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ring-2 ring-offset-1 ring-offset-transparent shadow-sm border border-black/10",
                                                opt.color || "bg-white",
                                                bgColor === opt.id ? "ring-black/40 scale-125 shadow-md" : "ring-transparent opacity-80 hover:opacity-100"
                                            )}
                                            title={opt.label}
                                        />
                                    ))}

                                    <div className="w-px h-6 bg-black/10 mx-1"></div>

                                    <div className="relative group w-8 h-8">
                                        <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-offset-1 ring-transparent hover:scale-110 transition-transform shadow-sm border border-black/10 bg-gradient-to-tr from-blue-400 via-purple-400 to-orange-400 cursor-pointer">
                                            <input
                                                type="color"
                                                onChange={handleCustomBgChange}
                                                className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                                                title="Pick custom page background"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button onClick={onCreate} className="rounded-full h-14 px-8 text-lg font-serif italic shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-1">
                        <Plus className="h-5 w-5 mr-2" />
                        New Entry
                    </Button>
                </div>
            </header>

            {entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center opacity-60">
                    <h3 className="font-serif text-3xl mb-4 italic text-muted-foreground">The page is blank...</h3>
                    <p className="font-sans text-lg text-muted-foreground/80 max-w-md">
                        But your mind isn't. Begin your first entry today.
                    </p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {entries.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.6 }}
                            onClick={() => onEdit(entry)}
                            className="break-inside-avoid relative group cursor-pointer"
                        >
                            <div
                                style={entry.customColor ? { backgroundColor: entry.customColor } : {}}
                                className={cn(
                                    "p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-transparent hover:border-border/50",
                                    !entry.customColor && getMoodStyle(entry.mood),
                                    entry.pinned && "ring-2 ring-primary/20 shadow-lg scale-[1.02]"
                                )}>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-sans text-xs tracking-wider uppercase opacity-50 font-bold flex items-center gap-2">
                                        {formatDate(entry.createdAt)}
                                        {entry.pinned && <Pin className="w-3 h-3 fill-current" />}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onPin(entry.id); }}
                                            className={cn(
                                                "p-2 rounded-full transition-all",
                                                entry.pinned ? "opacity-100 bg-black/5" : "opacity-0 group-hover:opacity-100 hover:bg-black/5"
                                            )}
                                            title={entry.pinned ? "Unpin entry" : "Pin entry"}
                                        >
                                            <Pin className={cn("h-4 w-4", entry.pinned && "fill-current text-primary")} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-black/5 rounded-full transition-all"
                                            title="Delete entry"
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-serif text-2xl md:text-3xl font-medium mb-4 text-primary leading-tight">
                                    {entry.title || <span className="opacity-30 italic">Untitled</span>}
                                </h3>

                                <p className="font-sans text-base text-muted-foreground line-clamp-[8] leading-relaxed opacity-90">
                                    {entry.content.replace(/<[^>]+>/g, '')}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}
