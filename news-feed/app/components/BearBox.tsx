
"use client"
import { useBearStore } from "../stores/bearStore";

export const BearBox = () => {

    const bearStore = useBearStore(state => state.bears);
    const increasePopulation = useBearStore(state => state.increasePopulation);
    const removeAllBears = useBearStore(state => state.removeAllBears);

    return (
        <div className="border-2 border-indigo-600 p-3">
            <h1>Bear Box</h1>
            <p>This is the bear box page.</p>
            <p>Bear Population: {bearStore}</p>
            <div className="flex flex-cols gap-4">
                <button className="btn btn-blue"  onClick={increasePopulation}>Increase Population</button>
                <button className="btn btn-blue"  onClick={removeAllBears}>Remove All Bears</button>
            </div>
        </div>
    )
}