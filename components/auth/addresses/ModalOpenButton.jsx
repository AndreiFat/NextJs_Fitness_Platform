'use client'
import React from 'react';

function ModalOpenButton({id, buttonName}) {
    return (
        <button className="btn btn-ghost" data-id={id}
                onClick={() => document.getElementById(id).showModal()}>
            {buttonName}
        </button>
    );
}

export default ModalOpenButton;