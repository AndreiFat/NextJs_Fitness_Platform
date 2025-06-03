'use client';

import {useState, useTransition} from 'react';
import {toggleFavoriteAIItem} from "@/app/(user)/ai-assistant/actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";

export default function FavoriteButton({type, item, itemHash, initiallySaved = false, onToggle}) {
    const [isSaved, setIsSaved] = useState(initiallySaved);
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            toggleFavoriteAIItem({type, item, itemHash}).then(({saved}) => {
                setIsSaved(saved);
                onToggle?.(saved);
            });
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`btn btn-circle flex items-center ${isSaved ? 'btn-error text-white' : 'btn-outline btn-error text-white'}`}
        >
            <span className="">{isSaved ? <FontAwesomeIcon size={"lg"} icon={faHeart}/> :
                <FontAwesomeIcon size={"lg"} icon={faHeartRegular}/>}</span>
        </button>
    );
}