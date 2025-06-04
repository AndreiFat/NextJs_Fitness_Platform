'use client'

import {useRouter, useSearchParams} from 'next/navigation';

export default function SortButtons({sortKey = 'name', labelAsc = 'A → Z', labelDesc = 'Z → A'}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSort = (direction) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', direction);
        params.set('sortKey', sortKey);

        router.push(`?${params.toString()}`);
    };

    const currentSort = searchParams.get('sort') || 'asc';

    return (
        <div className="flex items-center gap-2 mb-4">
            <label htmlFor={`sort-${sortKey}`} className="font-medium capitalize">Sort by {sortKey}:</label>
            <select
                id={`sort-${sortKey}`}
                className="select select-bordered select-sm"
                onChange={(e) => handleSort(e.target.value)}
                value={currentSort}
            >
                <option value="asc">{labelAsc}</option>
                <option value="desc">{labelDesc}</option>
            </select>
        </div>
    );
}