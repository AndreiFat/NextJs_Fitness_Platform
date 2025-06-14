'use client'
import React, {useState} from 'react';
import {toggleFavorite} from "@/app/(user)/favorites/actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";

function SaveToFavoritesButton({userId, productId, initialFavorite, isDisabled}) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);

    async function handleToggle() {
        setIsFavorite((prev) => !prev); // Optimistic UI update

        const result = await toggleFavorite(userId, productId);
        if (!result.success) {
            setIsFavorite((prev) => !prev); // Rollback if error
        }
    }

    return (
        <button onClick={handleToggle}
                className={`btn btn-circle p-2 ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white'} ${!isDisabled ? 'btn-disabled' : ''}`}>
            {isFavorite ? <FontAwesomeIcon icon={faHeartSolid}/> : <FontAwesomeIcon icon={faHeartRegular}/>}
        </button>
    );
}

export default SaveToFavoritesButton;