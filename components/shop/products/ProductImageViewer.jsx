'use client';
import {useState} from 'react';

export default function ProductImageViewer({images}) {
    const [selected, setSelected] = useState(images?.[0]?.publicUrl || null);

    if (!images || images.length === 0) return <p className="text-gray-500">No images available</p>;

    return (
        <div className="relative w-full">
            <div className="overflow-hidden rounded-lg border">
                <img
                    src={selected}
                    alt="Selected product"
                    className="w-full object-cover max-h-[400px]"
                />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.publicUrl}
                        onClick={() => setSelected(img.publicUrl)}
                        alt={`Thumbnail ${index + 1}`}
                        className={`h-16 w-full object-cover rounded-md border cursor-pointer transition hover:opacity-80 ${
                            selected === img.publicUrl ? 'ring-2 ring-indigo-500' : ''
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}