import { create } from "zustand"
import { persist } from "zustand/middleware"

type AppNotification = { id: string, message: string, type: 'info' | 'warning' | 'error' }

type AppState = {
    isSidebarOpen: boolean,
    notifications: AppNotification[]
}


export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isSidebarOpen: false,
            notifications: [],
        }),
        {name: 'app-store', partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen }) }
    )
)