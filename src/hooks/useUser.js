import { useState, useEffect } from "react"

export function useUser() {
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem("mindful_journal_user") || null
    })

    const [lockerPassword, setLockerPassword] = useState(() => {
        return localStorage.getItem("mindful_journal_locker_pw") || null
    })

    const saveUserName = (name) => {
        localStorage.setItem("mindful_journal_user", name)
        setUserName(name)
    }

    const saveLockerPassword = (password) => {
        localStorage.setItem("mindful_journal_locker_pw", password)
        setLockerPassword(password)
    }

    const verifyLockerPassword = (input) => {
        return lockerPassword && input === lockerPassword
    }

    const hasLockerPassword = () => !!lockerPassword

    return {
        userName,
        saveUserName,
        lockerPassword,
        saveLockerPassword,
        verifyLockerPassword,
        hasLockerPassword
    }
}
