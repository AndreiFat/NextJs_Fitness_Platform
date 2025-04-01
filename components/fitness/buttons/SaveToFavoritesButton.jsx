import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-regular-svg-icons";

function SaveToFavoritesButton(props) {
    return (
        <button className="btn btn-square hover:bg-error hover:text-white">
            <FontAwesomeIcon icon={faHeart} size={"lg"}></FontAwesomeIcon>
        </button>
    );
}

export default SaveToFavoritesButton;