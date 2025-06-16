'use client'
import React, {useEffect, useRef} from 'react';
import FooterComponent from "@/components/layout/FooterComponent";
import Link from "next/link";
import Product from "@/components/shop/products/Product";

function Homepage({products, error}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.35;
        }
    }, []);

    return (
        <div>
            {/* Hero Section cu Video */}
            <section className="relative min-h-screen w-full overflow-hidden">
                {/* 🎥 Background video */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                >
                    <source src="/assets/videos/video1.mp4" type="video/mp4"/>
                    Browserul tău nu suportă elementul video.
                </video>

                <div className="absolute inset-0 bg-black/75 z-10"/>

                <div
                    className="relative z-20 flex flex-col items-center justify-center min-h-screen text-white text-center px-6">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-extrabold mb-4">Marketplace de fitness, alimentat de AI</h1>
                        <p className="text-lg mb-6">
                            Descoperă produse premium pentru fitness, gestionează-ți obiectivele de sănătate și obține
                            recomandări personalizate prin AI — totul într-un singur loc.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link href={"/shop"} className="btn btn-accent px-6">Explorează Produse</Link>
                            <Link href={"/fitness"} className="btn btn-outline px-6">Testează AI Coach</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 bg-gradient-to-b from-primary-content to-secondary-content">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold mb-12 text-primary drop-shadow-md">Ce poți face aici?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[{
                            title: "Produse pentru Fitness",
                            description: "Alege dintr-o selecție atent aleasă de suplimente, echipamente și accesorii folosite de profesioniști. Calitate garantată pentru rezultate maxime.",
                            link: "/shop",
                            buttonTitle: "Explorează Produse",
                        }, {
                            title: "Management Fitness",
                            description: "Monitorizează-ți obiectivele, mesele și antrenamentele cu instrumente ușor de folosit, grafice detaliate și rapoarte personalizate.",
                            link: "/fitness",
                            buttonTitle: "Exlorează zona fitness"
                        }, {
                            title: "Integrare AI",
                            description: "Primește planuri de masă și antrenamente personalizate, generate de inteligență artificială, adaptate stilului tău de viață și obiectivelor.",
                            link: "/fitness",
                            buttonTitle: "Incearcă AI"
                        }].map(({title, description, link, buttonTitle}, idx) => (
                            <div key={idx}
                                 className="p-10 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.03] duration-300 bg-gradient-to-br from-primary/12 to-primary/2 border border-primary/40">
                                <h3 className="text-2xl font-semibold mb-4 text-primary">{title}</h3>
                                <p className="text-base-content/80 leading-relaxed">{description}</p>
                                <Link href={link} className={"btn btn-primary btn-outline mt-6"}>{buttonTitle}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-secondary-content">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4 text-primary text-center">Cele mai vândute produse</h2>
                    <p className="text-base-content/70 max-w-xl mx-auto mb-12 text-center">
                        Descoperă produsele preferate de comunitatea noastră de fitness – testate, apreciate și
                        recomandate pentru performanță maximă.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products ? (
                            products.map((product, index) => (
                                <div key={index}>
                                    <Product product={product}/>
                                </div>
                            ))) : <p>{error}</p>}
                    </div>
                    <div className="text-center">
                        <Link href={"/shop"} className={"btn btn-primary btn-outline mt-6"}>Exploreaza toate
                            produsele</Link>
                    </div>
                </div>
            </section>

            <section
                className="relative bg-cover bg-center bg-no-repeat min-h-[60vh] flex items-center justify-center"
                style={{backgroundImage: "url('/assets/fitness-bg.jpg')"}} // înlocuiește cu imaginea ta
            >
                <div
                    className="absolute inset-0 bg-gradient-to-br bg-base-300/85 from-primary/20 to-secondary/10 backdrop-blur-xs"></div>

                <div className="relative z-10 text-center px-6 max-w-2xl">
                    <h2 className="text-4xl font-extrabold text-primary mb-4 drop-shadow-lg">
                        Pregătit să-ți transformi stilul de viață?
                    </h2>
                    <p className="text-base-content/70 mb-6 text-lg">
                        Creează un cont și lasă inteligența artificială să-ți contureze drumul către un stil de viață
                        mai sănătos.
                    </p>
                    <a href={"/fitness"} className="btn btn-primary btn-lg px-10 shadow-lg hover:shadow-xl transition">
                        Începe acum
                    </a>
                </div>
            </section>

            <FooterComponent/>
        </div>
    );
}

export default Homepage;