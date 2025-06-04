'use client'

import {useRouter, useSearchParams} from 'next/navigation';

export default function CategoryFilterDropdown({categories}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e) => {
        const params = new URLSearchParams(searchParams);
        const value = e.target.value;

        if (value) {
            params.set('category', value);
        } else {
            params.delete('category');
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="mb-4">
            <label htmlFor="categoryFilter" className="mr-2 font-semibold">Filter by category:</label>
            <select
                id="categoryFilter"
                className="select select-bordered select-sm"
                defaultValue={searchParams.get('category') || ''}
                onChange={handleChange}
            >
                <option value="">All categories</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}