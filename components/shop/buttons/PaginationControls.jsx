'use client';

import {useRouter, useSearchParams} from 'next/navigation';

export default function PaginationControls({totalPages}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1');

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex justify-center gap-2 my-4">
            {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNum) => (
                <button
                    key={pageNum}
                    className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePageChange(pageNum)}
                >
                    {pageNum}
                </button>
            ))}
        </div>
    );
}