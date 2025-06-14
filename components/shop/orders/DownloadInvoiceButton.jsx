'use client'
import React from 'react';
import button from "daisyui/components/button";

function DownloadInvoiceButton({filePath, orderId}) {
    const handleDownload = () => {
        if (!filePath) {
            console.log("No invoice URL provided.")
            return
        }

        // Open in a new tab or force download
        const link = document.createElement('a')
        link.href = filePath
        link.download = `factura-comanda-${orderId}` // You can optionally set a filename here
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button
            onClick={handleDownload}
            className="cursor-pointer badge badge-lg text-sm badge-soft badge-info mt-2"
        >
            Download Invoice
        </button>
    )
}

export default DownloadInvoiceButton;