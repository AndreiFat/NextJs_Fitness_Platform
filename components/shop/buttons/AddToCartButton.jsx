import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartPlus} from "@fortawesome/free-solid-svg-icons";

function AddToCartButton(props) {
    return (
        <button className="btn btn-square hover:bg-primary hover:text-white">
            <FontAwesomeIcon icon={faCartPlus}></FontAwesomeIcon>
        </button>
    );
}

export default AddToCartButton;