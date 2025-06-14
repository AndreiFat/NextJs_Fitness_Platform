"use client";
import {useKeenSlider} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {useEffect} from "react";

export default function PromotionSlider({promotions}) {
    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slides: {perView: 1},
        drag: true,
    });

    // Auto-play every 4 seconds
    useEffect(() => {
        let timeout;
        const next = () => {
            instanceRef.current?.next();
            timeout = setTimeout(next, 4000);
        };
        timeout = setTimeout(next, 4000);
        return () => clearTimeout(timeout);
    }, [instanceRef]);

    return (
        <div ref={sliderRef} className="keen-slider rounded-xl overflow-hidden shadow-lg">
            {promotions.map((promo, index) => (
                <div
                    key={index}
                    className="keen-slider__slide relative h-84"
                    style={{
                        backgroundImage: `url(${promo.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay opac */}
                    <div className="absolute inset-0 bg-black/60 z-0"/>

                    {/* Textul deasupra overlay-ului */}
                    <div className="relative z-10 flex items-center justify-center h-full px-6 text-center text-white">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{promo.title}</h2>
                            <p className="text-sm text-white/90">{promo.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}