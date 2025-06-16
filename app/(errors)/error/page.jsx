'use client'
import {useRouter, useSearchParams} from 'next/navigation'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFaceSadCry} from "@fortawesome/free-solid-svg-icons";

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <FontAwesomeIcon icon={faFaceSadCry} className="text-7xl mb-4"/>
                <h2 className="text-xl font-bold mb-2">Ceva nu a mers bine!</h2>
                <p>{message || 'A apărut o eroare neașteptată.'}</p>
                <button onClick={() => router.back()} className="btn btn-outline mt-4">
                    Înapoi
                </button>
            </div>
        </div>
    )
}