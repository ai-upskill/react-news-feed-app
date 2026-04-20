"use client"
const images = [
    "https://picsum.photos/200/300",
    "https://picsum.photos/200/300?2",
    "https://picsum.photos/200/300?3",
    "https://picsum.photos/200/300?4",
    "https://picsum.photos/200/300?5",
    "https://picsum.photos/200/300?6",
]

function ImageCard({ src, alt }: { src: string, alt: string }) {
    return (
        <div className="w-full h-64 bg-gray-300 rounded-lg shadow-md">
            <img src={src} alt={alt} className="w-full h-full object-cover" onClick={() => window.alert('test')} />
        </div>
    )
}

export default function Gallery() {

    const imageItems = images.map((o, i) => <ImageCard src={o} alt={o} key={i} />);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Gallery</h1>
            <p className="text-gray-600">This is the gallery page.</p>
            <div className="flex flex-row gap-4">
               {imageItems}
            </div>
        </div>
    )
}