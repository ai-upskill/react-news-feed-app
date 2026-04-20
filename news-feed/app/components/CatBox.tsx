
"use client"
import { useEffect, useState } from "react"
import { useCatStore } from "../stores/CatStore"

export const CatBox = () => {

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(()=>setHasMounted(true));

    const { cats, summary, increaseBigCats, increaseSmallCats } = useCatStore()

    if(hasMounted){
        return (
            <div className="border-2 border-indigo-600 p-3">
                <h1>Cat box</h1>
                <h4>{cats.smallCats} | {cats.bigCats}</h4>
                <div className="flex flex-cols gap-4">
                    <button className="btn btn-blue" onClick={increaseBigCats}>Increase Big Cats</button>
                    <button className="btn btn-blue" onClick={increaseSmallCats}>Increase Small Cats</button>
                </div>
            </div>
        )
    }
    else return (<span>Loading</span>)
}