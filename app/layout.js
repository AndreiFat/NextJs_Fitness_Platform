import "@/app/globals.css";
import NavbarComponent from "@/components/layout/NavbarComponent";
import React from "react";

import {config} from '@fortawesome/fontawesome-svg-core' // 👈
import '@fortawesome/fontawesome-svg-core/styles.css'
import MinimalFooterComponent from "@/components/layout/MinimalFooterComponent"; // 👈
config.autoAddCss = false //

export const metadata = {
    title: "FitMind — Antrenorul tău AI pentru minte și corp",
    description:
        "FitMind este platforma ta inteligentă de fitness și nutriție, alimentată de AI. Creează-ți planuri personalizate, urmărește progresul și atinge-ți obiectivele de sănătate fizică și mentală.",
    icons: {
        icon: "/nextjs-icon.svg",
    },
};

export default function RootLayout({children}) {
    return (
        <html lang="en" data-theme="forest">
        <body
        >
        <NavbarComponent/>
        <div className="min-h-[calc(100vh-54px)] bg-linear-to-t bg-base-300 from-primary/20 to-base-300">
            {children}
        </div>
        <MinimalFooterComponent></MinimalFooterComponent></body>
        </html>
    );
}
