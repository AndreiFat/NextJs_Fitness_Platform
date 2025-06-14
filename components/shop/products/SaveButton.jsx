"use client";

import {useTransition} from "react";

export default function SaveButton({formId, modalId, label = "Save Changes"}) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        const form = document.getElementById(formId);
        if (form) {
            form.requestSubmit(); // trimite form-ul
        }
    };

    return (
        <button
            type="button"
            onClick={() => {
                startTransition(() => {
                    handleClick();
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        modal.close();
                    }
                });
            }}
            disabled={isPending}
            className="btn btn-primary mt-3"
        >
            {isPending ? "Saving..." : label}
        </button>
    );
}