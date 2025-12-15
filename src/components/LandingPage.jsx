import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Sparkles } from "lucide-react"

export function LandingPage({ onStart }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-5xl mx-auto relative overflow-hidden">

            {/* Abstract Background Shapes */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-mood-calm/30 rounded-full blur-[100px] -z-10"
            />
            <motion.div
                animate={{
                    rotate: [360, 0],
                    scale: [1, 1.3, 1],
                    x: [0, -50, 0]
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-mood-joy/20 rounded-full blur-[120px] -z-10"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="space-y-10 z-10"
            >
                <div className="relative inline-block">
                    <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight text-primary leading-[1.1]">
                        My<br />Entry
                    </h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                        className="h-1 bg-accent absolute bottom-2 left-0"
                    />
                </div>

                <p className="font-sans text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed tracking-wide font-light">
                    A sanctuary for your thoughts. Designed for <span className="text-foreground font-medium">clarity</span>, built for <span className="text-foreground font-medium">reflection</span>.
                </p>

                <div className="pt-12">
                    <Button
                        size="lg"
                        onClick={() => onStart("dashboard")}
                        className="text-lg px-12 py-8 rounded-full shadow-2xl hover:shadow-primary/10 bg-primary text-primary-foreground hover:scale-105 transition-transform duration-300 font-serif italic tracking-wider"
                    >
                        Start Writing <ArrowRight className="ml-3 h-5 w-5" />
                    </Button>
                </div>
            </motion.div>

        </div>
    )
}
