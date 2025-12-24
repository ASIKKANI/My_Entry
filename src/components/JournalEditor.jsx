import React, { useState, useMemo, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Palette, Type, Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, Quote, Eraser, Check, ChevronDown } from "lucide-react"
import { cn, isColorDark } from "@/lib/utils"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css" // Toolbar theme

// --- FONT CONFIGURATION ---
const FONT_SIZES = [
    { name: "small", label: "Small", css: "0.85em" },
    { name: "normal", label: "Normal", css: "1em" },
    { name: "medium", label: "Medium", css: "1.25em" },
    { name: "large", label: "Large", css: "1.5em" },
    { name: "huge", label: "Huge", css: "2.5em" },
]

const FONTS = [
    // Standard
    { name: "sans", label: "Inter", family: "'Inter', sans-serif" },
    { name: "serif", label: "Playfair Display", family: "'Playfair Display', serif" },
    { name: "monospace", label: "Roboto Mono", family: "'Roboto Mono', monospace" },

    // Aesthetic & Elegant
    { name: "elegant", label: "Cormorant", family: "'Cormorant Garamond', serif" },
    { name: "classic", label: "Cinzel", family: "'Cinzel', serif" },
    { name: "pinyon", label: "Pinyon Script", family: "'Pinyon Script', cursive" },
    { name: "petit", label: "Petit Formal", family: "'Petit Formal Script', cursive" },
    { name: "parisienne", label: "Parisienne", family: "'Parisienne', cursive" },

    // Handwriting & Casual
    { name: "casual", label: "Gloria Hallelujah", family: "'Gloria Hallelujah', cursive" },
    { name: "shadows", label: "Shadows Into Light", family: "'Shadows Into Light', cursive" },
    { name: "sacramento", label: "Sacramento", family: "'Sacramento', cursive" },
    { name: "marck", label: "Marck Script", family: "'Marck Script', cursive" },
    { name: "vibes", label: "Great Vibes", family: "'Great Vibes', cursive" },
    { name: "comic", label: "Architects Daughter", family: "'Architects Daughter', cursive" },

    // Display
    { name: "marker", label: "Permanent Marker", family: "'Permanent Marker', cursive" },
    { name: "heavy", label: "Abril Fatface", family: "'Abril Fatface', cursive" },
    { name: "pixel", label: "Press Start 2P", family: "'Press Start 2P', monospace" },
    { name: "tangerine", label: "Tangerine", family: "'Tangerine', cursive" },
]

// Register Whitelists
const Font = Quill.import("formats/font")
Font.whitelist = FONTS.map(f => f.name)
Quill.register(Font, true)

const Size = Quill.import("formats/size")
Size.whitelist = FONT_SIZES.map(s => s.name)
Quill.register(Size, true)

const MOODS = [
    { id: "calm", label: "Calm", color: "bg-[#BBDEFB]", hex: "#BBDEFB" },
    { id: "joy", label: "Joy", color: "bg-[#FFE0B2]", hex: "#FFE0B2" },
    { id: "focus", label: "Focus", color: "bg-[#E1BEE7]", hex: "#E1BEE7" },
    { id: "nature", label: "Nature", color: "bg-[#C8E6C9]", hex: "#C8E6C9" },
]

// Custom Toolbar Component
const CustomToolbar = ({ isDark, onAutoClose, quillRef, titleFont, setTitleFont, activeContext }) => {
    const toolbarRef = useRef(null)
    const [currentFormat, setCurrentFormat] = useState({})
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false)
    const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false)

    // Sync state with cursor
    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor()
            const updateState = () => {
                requestAnimationFrame(() => {
                    const range = quill.getSelection()
                    if (range) {
                        const formats = quill.getFormat(range)
                        setCurrentFormat(formats)
                    }
                })
            }
            updateState()
            quill.on('selection-change', updateState)
            return () => quill.off('selection-change', updateState)
        }
    }, [quillRef])

    // Click Outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
                // We handle closing in parent usually, or here.
                // Currently parent handles close on click elsewhere if this is just a component.
                // But wait, the parent sends onAutoClose.
                onAutoClose()
            }
        }
        setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("touchstart", handleClickOutside)
        }, 100)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("touchstart", handleClickOutside)
        }
    }, [onAutoClose])

    // Format Handlers
    const toggleFormat = (format, value) => {
        if (activeContext === 'title') return; // Styling disabled for title

        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            quill.focus();

            const formats = quill.getFormat()
            const isActive = formats[format] === value || (value === true && !!formats[format])

            if (isActive) {
                quill.format(format, false);
            } else {
                quill.format(format, value);
            }
            setTimeout(onAutoClose, 50);
        }
    }

    const handleFontSelect = (fontName) => {
        if (activeContext === 'title') {
            setTitleFont(fontName);
            setIsFontMenuOpen(false);
            setTimeout(onAutoClose, 50);
        } else {
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                quill.focus();
                quill.format('font', fontName);
                setIsFontMenuOpen(false); // Close nested menu
                setTimeout(onAutoClose, 50); // Close main toolbar
            }
        }
    }

    const handleSizeSelect = (sizeName) => {
        if (activeContext === 'title') return;
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            quill.focus();
            quill.format('size', sizeName);
            setIsSizeMenuOpen(false);
            setTimeout(onAutoClose, 50);
        }
    }

    const isActive = (format, value) => {
        if (activeContext === 'title') return false;
        if (value === true) return !!currentFormat[format]
        return currentFormat[format] === value
    }

    // Determine label for current font
    // If context is title, use titleFont. If body, use quill format.
    const effectiveFontName = activeContext === 'title'
        ? (titleFont || 'serif')
        : (currentFormat.font || 'sans');

    const currentFontObj = FONTS.find(f => f.name === effectiveFontName) || FONTS[0]

    // Determine current size
    const currentSizeName = currentFormat.size || 'normal';
    const currentSizeObj = FONT_SIZES.find(s => s.name === currentSizeName) || FONT_SIZES.find(s => s.name === 'normal');

    return (
        <div
            ref={toolbarRef}
            className={cn(
                "flex flex-col gap-4 p-5 rounded-3xl border transition-colors duration-300 shadow-2xl max-w-[95vw] w-[320px] pointer-events-auto h-auto max-h-[80vh] overflow-y-auto",
                isDark ? "bg-black/95 border-white/20 text-white" : "bg-white/95 border-black/10 text-black"
            )}
            style={{ fontFamily: "Inter, sans-serif" }} // Reset inner font
            onMouseDown={(e) => e.stopPropagation()} // Prevent blur of editor/input
        >
            <div className="flex justify-between items-center pb-2 border-b border-current/10 shrink-0">
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                    {activeContext === 'title' ? 'Title Styling' : 'Editing Tools'}
                </span>
                <button onClick={onAutoClose} className="p-1 hover:bg-current/10 rounded-full">
                    <Check size={16} />
                </button>
            </div>

            {/* Custom Font Selector with Preview */}
            <div className="flex flex-col gap-2 shrink-0 relative">
                <label className="text-[10px] uppercase tracking-wider opacity-50 font-sans">Typography</label>

                <div className="flex gap-2">
                    {/* Font Family Dropdown */}
                    <div className="relative flex-1">
                        <button
                            onClick={() => { setIsFontMenuOpen(!isFontMenuOpen); setIsSizeMenuOpen(false); }}
                            className="w-full h-12 flex items-center justify-between bg-current/5 border border-current/10 rounded-xl px-4 hover:bg-current/10 transition-colors"
                        >
                            <span
                                className="text-lg truncate mr-2"
                                style={{ fontFamily: currentFontObj.family }}
                            >
                                {currentFontObj.label}
                            </span>
                            <ChevronDown size={16} className={cn("transition-transform opacity-50", isFontMenuOpen ? "rotate-180" : "")} />
                        </button>

                        {/* Dropdown List */}
                        <AnimatePresence>
                            {isFontMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 flex flex-col max-h-[300px] overflow-y-auto bg-white dark:bg-black"
                                >
                                    {FONTS.map(font => (
                                        <button
                                            key={font.name}
                                            onClick={() => handleFontSelect(font.name)}
                                            className={cn(
                                                "px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center justify-between group",
                                                effectiveFontName === font.name ? "bg-primary/5 text-primary" : ""
                                            )}
                                        >
                                            <span className="text-xl" style={{ fontFamily: font.family }}>
                                                {font.label}
                                            </span>
                                            {effectiveFontName === font.name && <Check size={14} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Font Size Dropdown (Disabled for Title) */}
                    <div className={cn("relative w-24 transition-opacity", activeContext === 'title' && "opacity-30 pointer-events-none")}>
                        <button
                            onClick={() => { setIsSizeMenuOpen(!isSizeMenuOpen); setIsFontMenuOpen(false); }}
                            className="w-full h-12 flex items-center justify-between bg-current/5 border border-current/10 rounded-xl px-3 hover:bg-current/10 transition-colors"
                        >
                            <span className="text-sm font-medium">
                                {currentSizeObj?.label || "Size"}
                            </span>
                            <ChevronDown size={14} className={cn("transition-transform opacity-50", isSizeMenuOpen ? "rotate-180" : "")} />
                        </button>

                        <AnimatePresence>
                            {isSizeMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="absolute top-full right-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 flex flex-col bg-white dark:bg-black"
                                >
                                    {FONT_SIZES.map(size => (
                                        <button
                                            key={size.name}
                                            onClick={() => handleSizeSelect(size.name)}
                                            className={cn(
                                                "px-4 py-2 text-left hover:bg-primary/5 transition-colors flex items-center justify-between",
                                                currentSizeName === size.name ? "bg-primary/5 text-primary" : ""
                                            )}
                                        >
                                            <span className="text-sm">{size.label}</span>
                                            {currentSizeName === size.name && <Check size={12} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Standard Tools (Disabled if Title) */}
            <div className={cn("grid grid-cols-2 gap-4 shrink-0 transition-opacity", activeContext === 'title' && "opacity-30 pointer-events-none")}>
                {/* Style */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider opacity-50 font-sans">Style</label>
                    <div className="flex gap-1 justify-between bg-current/5 p-1 rounded-xl">
                        <button
                            className={cn("p-2 rounded-lg flex-1 flex justify-center transition-colors", isActive('bold', true) ? "bg-current/20 text-blue-500" : "hover:bg-current/10")}
                            onClick={() => toggleFormat('bold', true)}
                        >
                            <Bold size={18} />
                        </button>
                        <button
                            className={cn("p-2 rounded-lg flex-1 flex justify-center transition-colors", isActive('italic', true) ? "bg-current/20 text-blue-500" : "hover:bg-current/10")}
                            onClick={() => toggleFormat('italic', true)}
                        >
                            <Italic size={18} />
                        </button>
                        <button
                            className={cn("p-2 rounded-lg flex-1 flex justify-center transition-colors", isActive('underline', true) ? "bg-current/20 text-blue-500" : "hover:bg-current/10")}
                            onClick={() => toggleFormat('underline', true)}
                        >
                            <Underline size={18} />
                        </button>
                    </div>
                </div>

                {/* Headers */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider opacity-50 font-sans">Headers</label>
                    <div className="flex gap-1 justify-between bg-current/5 p-1 rounded-xl">
                        <button
                            className={cn("p-2 rounded-lg flex-1 flex justify-center transition-colors", isActive('header', 1) ? "bg-current/20 text-blue-500" : "hover:bg-current/10")}
                            onClick={() => toggleFormat('header', 1)}
                        >
                            <Heading1 size={18} />
                        </button>
                        <button
                            className={cn("p-2 rounded-lg flex-1 flex justify-center transition-colors", isActive('header', 2) ? "bg-current/20 text-blue-500" : "hover:bg-current/10")}
                            onClick={() => toggleFormat('header', 2)}
                        >
                            <Heading2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Extras */}
            <div className={cn("flex flex-col gap-2 shrink-0 transition-opacity", activeContext === 'title' && "opacity-30 pointer-events-none")}>
                <label className="text-[10px] uppercase tracking-wider opacity-50 font-sans">Layout & Actions</label>
                <div className="flex gap-2">
                    <button
                        className={cn("flex-1 h-10 flex items-center justify-center rounded-xl transition-colors", isActive('list', 'bullet') ? "bg-current/20 text-blue-500" : "bg-current/5 hover:bg-current/10")}
                        onClick={() => toggleFormat('list', 'bullet')}
                    >
                        <List size={18} />
                    </button>
                    <button
                        className={cn("flex-1 h-10 flex items-center justify-center rounded-xl transition-colors", isActive('blockquote', true) ? "bg-current/20 text-blue-500" : "bg-current/5 hover:bg-current/10")}
                        onClick={() => toggleFormat('blockquote', true)}
                    >
                        <Quote size={18} />
                    </button>
                    <button
                        className="flex-1 h-10 flex items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20"
                        onClick={() => toggleFormat('clean')}
                    >
                        <Eraser size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export function JournalEditor({ entry, onBack, onSave }) {
    const [title, setTitle] = useState(entry?.title || "")
    const [content, setContent] = useState(entry?.content || "")
    const [titleFont, setTitleFont] = useState(entry?.titleFont || "serif")
    const [selectedMood, setSelectedMood] = useState(entry?.mood || null)
    const [customColor, setCustomColor] = useState(entry?.customColor || null)

    const [isPaletteOpen, setIsPaletteOpen] = useState(false)
    const [isToolbarOpen, setIsToolbarOpen] = useState(false)
    const [activeContext, setActiveContext] = useState('body') // 'title' or 'body'

    const quillRef = useRef(null)

    // Debounced Auto-Save
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title || content) {
                console.log("Auto-saving...")
                handleSave(false)
            }
        }, 2000)
        return () => clearTimeout(timer)
    }, [title, content, selectedMood, customColor, titleFont])

    const currentBgColor = customColor || (selectedMood ? MOODS.find(m => m.id === selectedMood)?.hex : null);
    const isDark = currentBgColor ? isColorDark(currentBgColor) : false;

    // Text Color
    const textColorClass = !currentBgColor
        ? "text-primary placeholder:text-primary/20"
        : (isDark ? "text-white placeholder:text-white/40" : "text-black placeholder:text-black/40");

    const quillClass = !currentBgColor
        ? "text-primary/90"
        : (isDark ? "text-white/90" : "text-black/90");

    const bgStyle = customColor ? { backgroundColor: customColor } : {}
    const bgClass = !customColor ? (MOODS.find(m => m.id === selectedMood)?.color || "bg-background") : ""

    const handleSave = (shouldExit = true) => {
        onSave({
            id: entry?.id,
            title,
            content,
            mood: selectedMood,
            customColor,
            titleFont
        }, shouldExit)
    }

    const handleCustomColorChange = (e) => {
        setCustomColor(e.target.value)
        setSelectedMood(null)
    }

    const handleToolbarAutoClose = () => {
        setIsToolbarOpen(false);
        // Do not force blur; keep focus where it was if possible
    }

    const modules = useMemo(() => ({
        toolbar: false,
        keyboard: { bindings: {} }
    }), [])

    const formats = useMemo(() => [
        'font', 'size',
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'blockquote',
        'clean'
    ], [])

    // Get font family prop for Title Input
    const titleFontFamily = FONTS.find(f => f.name === titleFont)?.family || "'Playfair Display', serif"

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
            {/* Header / Nav */}
            <div className="w-full max-w-6xl p-6 md:p-8 flex items-center justify-between sticky top-0 z-50 pointer-events-none">
                {/* Left: Back */}
                <div className="pointer-events-auto">
                    <Button variant="ghost" size="icon" onClick={onBack} className={cn("rounded-full w-14 h-14 hover:bg-black/10 transition-transform hover:scale-110", isDark ? "text-white hover:bg-white/10" : "text-primary")}>
                        <ArrowLeft className="h-8 w-8" />
                    </Button>
                </div>

                {/* Center: Tools */}
                <div className="pointer-events-auto flex gap-4 bg-white/20 backdrop-blur-xl p-2 rounded-full shadow-lg border border-white/20">
                    {/* Style Button */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPaletteOpen(!isPaletteOpen);
                                setIsToolbarOpen(false);
                            }}
                            className={cn("rounded-full w-10 h-10 transition-all hover:scale-105", isPaletteOpen ? "bg-white/30" : "")}
                        >
                            <Palette className={cn("h-5 w-5", isDark ? "text-white" : "text-black")} />
                        </Button>

                        {/* Palette Popover */}
                        <AnimatePresence>
                            {isPaletteOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[100]"
                                >
                                    <div className="bg-white/95 backdrop-blur-2xl p-4 rounded-[2rem] shadow-2xl border border-white/50 flex flex-wrap justify-center items-center gap-3 w-[80vw] max-w-[280px]">
                                        {MOODS.map((mood) => (
                                            <button
                                                key={mood.id}
                                                onClick={() => { setSelectedMood(mood.id); setCustomColor(null); setIsPaletteOpen(false); }}
                                                className={cn(
                                                    "w-8 h-8 rounded-full ring-2 ring-offset-2 ring-offset-transparent transition-all hover:scale-110",
                                                    mood.color,
                                                    selectedMood === mood.id ? "ring-black/40 scale-110" : "ring-transparent opacity-80"
                                                )}
                                                title={mood.label}
                                            />
                                        ))}
                                        <div className="relative group w-8 h-8 rounded-full overflow-hidden ring-2 ring-offset-2 ring-transparent bg-gradient-to-tr from-blue-400 via-purple-400 to-orange-400">
                                            <input
                                                type="color"
                                                value={customColor || "#ffffff"}
                                                onChange={handleCustomColorChange}
                                                className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Format Button */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsToolbarOpen(!isToolbarOpen);
                                setIsPaletteOpen(false);
                            }}
                            className={cn(
                                "rounded-full w-10 h-10 transition-all hover:scale-105",
                                "bg-white/30 shadow-inner"
                            )}
                        >
                            <Type className={cn("h-5 w-5", isDark ? "text-white" : "text-black")} />
                        </Button>

                        {/* Toolbar Popover */}
                        {isToolbarOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-[100] animate-in slide-in-from-top-2 fade-in duration-300">
                                <CustomToolbar
                                    isDark={isDark}
                                    onAutoClose={handleToolbarAutoClose}
                                    quillRef={quillRef}
                                    titleFont={titleFont}
                                    setTitleFont={setTitleFont}
                                    activeContext={activeContext}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Save */}
                <div className="pointer-events-auto">
                    <Button
                        className="rounded-full px-6 py-4 font-serif italic text-md shadow-lg hover:shadow-xl bg-primary text-primary-foreground min-w-[100px]"
                        onClick={() => handleSave(true)}
                    >
                        Save
                    </Button>
                </div>
            </div>

            {/* Editor Surface */}
            <div className="w-full max-w-3xl flex-1 px-6 pb-20 mt-4 relative flex flex-col">
                <input
                    type="text"
                    placeholder="Untitled"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setActiveContext('title')}
                    // We don't blur strict here, but we can detect selection change of quill to switch back
                    style={{ fontFamily: titleFontFamily }}
                    className={cn(
                        "w-full bg-transparent text-4xl md:text-6xl font-serif font-medium mb-6 outline-none border-none text-center transition-colors duration-300 placeholder:opacity-40",
                        textColorClass
                    )}
                />

                <div
                    className={cn(
                        "flex-1 min-h-[60vh] text-lg md:text-xl font-serif leading-relaxed cursor-text transition-colors duration-300 relative",
                        quillClass
                    )}
                    onClick={() => setActiveContext('body')}
                >
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        onFocus={() => setActiveContext('body')}
                        placeholder="Start writing..."
                        className="h-full"
                        modules={modules}
                        formats={formats}
                    />

                    {/* Style Overrides */}
                    <style>{`
                        /* Remove border from editor container */
                        .ql-container.ql-snow {
                            border: none !important;
                            font-size: 1.125rem !important;
                        }
                        /* Hide Default Toolbar if it appears */
                        .ql-toolbar { display: none !important; }

                        .ql-editor.ql-blank::before {
                            color: ${isDark ? 'rgba(255,255,255,0.4)' : (!currentBgColor ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.4)')} !important;
                            font-style: italic;
                        }
                        .ql-editor {
                            color: ${isDark ? '#ffffff' : '#000000'};
                            padding: 0 !important;
                        }
                        
                         /* Font Mappings */
                        ${FONTS.map(f => `
                            .ql-font-${f.name} { 
                                font-family: ${f.family} !important; 
                                ${f.name === 'pixel' ? 'font-size: 0.8em;' : ''}
                                ${f.name === 'vibes' || f.name === 'pinyon' ? 'font-size: 1.4em; line-height: 1.6;' : ''}
                            }
                        `).join('')}

                        /* Font Size Mappings */
                        ${FONT_SIZES.map(s => `
                            .ql-size-${s.name} {
                                font-size: ${s.css} !important;
                            }
                        `).join('')}
                    `}</style>
                </div>
            </div>
        </motion.div>
    )
}
