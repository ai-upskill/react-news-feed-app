import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

type TCatState = {
    cats: {
        bigCats: number,
        smallCats: number
    },
    increaseBigCats: ()=> void,
    increaseSmallCats: ()=> void,
    removeAllCats: ()=> void,
    summary: () => string
}

export const useCatStore = create<TCatState>()(
    persist(immer((set, get) => ({
            cats: {
                bigCats: 0,
                smallCats: 0
            },
            increaseBigCats: () => set((state)=>{
                state.cats.bigCats++
            }),
            increaseSmallCats: () => set((state) => {
                state.cats.smallCats++
            }),
            removeAllCats: () => set((state) => {
                state.cats.bigCats = 0;
                state.cats.smallCats = 0;
            }),
            summary: () => {
                const state = get();
                return `There are total ${state.cats.smallCats} small-cats & ${state.cats.bigCats} big-cats`
            }
        })
     ),{
        name: 'cat-store',
        // onRehydrateStorage: () => (state) => {
        //     state.setHasHydrated(true);
        // },
    })
)