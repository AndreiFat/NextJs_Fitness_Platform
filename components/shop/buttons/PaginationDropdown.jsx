'use client';

import {useRouter, useSearchParams} from 'next/navigation';

export default function PaginationDropdown({paramName = 'limit', options = [10, 15, 30]}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentLimit = searchParams.get(paramName) || options[0];

    const handleChange = (e) => {
        const newLimit = e.target.value;
        const params = new URLSearchParams(searchParams);
        params.set(paramName, newLimit);
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="form-control w-full">
            <label className="label mb-1">
                <span className="text-base-content font-medium capitalize">Produse pe pagină</span>
            </label>
            <select
                className="select select-bordered select-sm w-full"
                value={currentLimit}
                onChange={handleChange}
            >
                {options.map((value) => (
                    <option key={value} value={value}>
                        {value} produse
                    </option>
                ))}
            </select>
        </div>
    );
}