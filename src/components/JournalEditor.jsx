import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.bubble.css" // Minimal theme

const MOODS = [
    { id: "calm", label: "Calm", color: "bg-[#BBDEFB]" }, // Darker Blue
    { id: "joy", label: "Joy", color: "bg-[#FFE0B2]" },   // Darker Orange
    { id: "focus", label: "Focus", color: "bg-[#E1BEE7]" }, // Darker Purple
    { id: "nature", label: "Nature", color: "bg-[#C8E6C9]" }, // Darker Green
]

export function JournalEditor({ entry, onBack, onSave }) {
    const [title, setTitle] = useState(entry?.title || "")
    const [content, setContent] = useState(entry?.content || "")
    const [selectedMood, setSelectedMood] = useState(entry?.mood || null)
    const [customColor, setCustomColor] = useState(entry?.customColor || null)
    const [isPaletteOpen, setIsPaletteOpen] = useState(false)

    // Debounced Auto-Save
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (title || content) {
                console.log("Auto-saving...")
                handleSave(false) // Auto-save, do not exit
            }
        }, 2000)
        return () => clearTimeout(timer)
    }, [title, content, selectedMood, customColor])

    // Mood Background Logic
    // If customColor is set, use it as style. Otherwise use Tailwind class from selectedMood.
    const bgStyle = customColor ? { backgroundColor: customColor } : {}
    const bgClass = !customColor ? (MOODS.find(m => m.id === selectedMood)?.color || "bg-background") : ""

    const handleSave = (shouldExit = true) => {
        onSave({
            id: entry?.id,
            title,
            content,
            mood: selectedMood,
            customColor // Save custom color too
        }, shouldExit)
    }

    // Handle Custom Color Change
    const handleCustomColorChange = (e) => {
        setCustomColor(e.target.value)
        setSelectedMood(null) // Clear preset mood if custom is picked
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={bgStyle}
            className={cn(
                "min-h-screen w-full transition-colors duration-500 ease-out flex flex-col items-center",
                bgClass
            )}
        >
            {/* Navigation Bar */}
            <div className="w-full max-w-6xl p-6 md:p-8 flex items-center justify-between sticky top-0 z-50 bg-gradient-to-b from-white/0 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full w-14 h-14 hover:bg-black/5 transition-transform hover:scale-110">
                        <ArrowLeft className="h-8 w-8 text-primary" />
                    </Button>
                </div>

                <div className="relative pointer-events-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                        className="rounded-full w-12 h-12 shadow-sm bg-white/50 hover:bg-white/80 backdrop-blur-md transition-all hover:scale-105"
                        title="Change Styling"
                    >
                        <Palette className="h-6 w-6 text-primary/80" />
                    </Button>

                    <AnimatePresence>
                        {isPaletteOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 30 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex items-center gap-4 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-full shadow-2xl border border-white/50 min-w-max z-50"
                            >
                                {MOODS.map((mood) => (
                                    <button
                                        key={mood.id}
                                        onClick={() => { setSelectedMood(mood.id); setCustomColor(null); setIsPaletteOpen(false); }}
                                        className={cn(
                                            "w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ring-4 ring-offset-2 ring-offset-background/0 shadow-sm border-2 border-white/50",
                                            mood.color,
                                            selectedMood === mood.id ? "ring-black/40 scale-125 shadow-md" : "ring-transparent opacity-80 hover:opacity-100 grayscale-[0.2] hover:grayscale-0"
                                        )}
                                        title={mood.label}
                                        aria-label={`Select ${mood.label} mood`}
                                    />
                                ))}

                                <div className="w-px h-8 bg-black/10 mx-2"></div>

                                <div className="relative group">
                                    <div className="w-10 h-10 rounded-full overflow-hidden ring-4 ring-offset-2 ring-offset-background/0 ring-transparent hover:scale-110 transition-transform shadow-sm border-2 border-white/50 bg-gradient-to-tr from-blue-400 via-purple-400 to-orange-400 cursor-pointer">
                                        <input
                                            type="color"
                                            onChange={handleCustomColorChange}
                                            className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                                            title="Pick a custom color"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pointer-events-auto">
                    <Button
                        className="rounded-full px-8 py-6 font-serif italic text-lg shadow-lg hover:shadow-xl bg-primary text-primary-foreground"
                        onClick={handleSave}
                    >
                        Save Entry
                    </Button>
                </div>
            </div>

            {/* Editor Surface */}
            <div className="w-full max-w-3xl flex-1 px-6 pb-20 mt-8 relative flex flex-col">
                <input
                    type="text"
                    placeholder="Title your entry..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-5xl md:text-6xl font-serif font-medium mb-8 outline-none placeholder:text-primary/20 text-primary bg-none border-none text-center"
                />

                <div
                    className="flex-1 min-h-[60vh] text-lg md:text-xl font-serif leading-relaxed text-primary/90 cursor-text"
                    onClick={() => {
                        // Focus the editor when clicking the container
                        const editor = document.querySelector('.ql-editor');
                        if (editor) editor.focus();
                    }}
                >
                    <ReactQuill
                        theme="bubble"
                        value={content}
                        onChange={setContent}
                        placeholder="Start writing..."
                        className="h-full"
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'header': 1 }, { 'header': 2 }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['blockquote'],
                                ['clean']
                            ]
                        }}
                    />
                </div>
            </div>

        </motion.div>
    )
}
