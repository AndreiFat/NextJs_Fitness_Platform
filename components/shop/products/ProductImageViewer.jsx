'use client';
import React, {useState} from 'react';

export default function ProductImageViewer({images}) {
    const [selected, setSelected] = useState(images?.[0]?.publicUrl || null);

    if (!images || images.length === 0) return <p className="text-gray-500">No images available</p>;

    return (
        <div className="relative w-full">
            <div
                className="h-[350px] w-full bg-cover bg-center rounded-xl shadow-2xl  shadow-white/12"
                style={{
                    backgroundImage: `url(${selected})`
                }}
            ></div>
            <div className="grid grid-cols-4 gap-2 mt-4 w-full">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.publicUrl}
                        onClick={() => setSelected(img.publicUrl)}
                        alt={`Thumbnail ${index + 1}`}
                        className={`h-16 w-full object-cover rounded-md border cursor-pointer transition hover:opacity-80 ${
                            selected === img.publicUrl ? 'ring-2 ring-primary' : ''
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}