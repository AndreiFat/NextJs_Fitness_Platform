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
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor="categoryFilter" className="font-medium capitalize">Filtreaza după categorie</label>
            <select
                id="categoryFilter"
                className="select select-bordered select-sm w-full"
                defaultValue={searchParams.get('category') || ''}
                onChange={handleChange}
            >
                <option value="">Toate categoriile</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}