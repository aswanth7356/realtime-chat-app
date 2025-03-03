import { create } from 'zustand'




export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "acid",        /* Lofi is the default theme , We can change*/
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme)
        set({ theme })
    }
}))     