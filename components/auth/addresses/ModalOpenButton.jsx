'use client'
import React from 'react';

function ModalOpenButton({id, buttonName, className}) {
    return (
        <button className={`btn ${className}`} data-id={id}
                onClick={() => document.getElementById(id).showModal()}>
            {buttonName}
        </button>
    );
}

export default ModalOpenButton;