import { useState, useEffect } from "react"

export function useUser() {
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem("mindful_journal_user") || null
    })

    const saveUserName = (name) => {
        localStorage.setItem("mindful_journal_user", name)
        setUserName(name)
    }

    return { userName, saveUserName }
}
