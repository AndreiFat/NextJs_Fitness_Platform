'use client'
import React, {useState, useTransition} from 'react';
import {modifyStatus} from "@/app/(shop)/admin/orders/actions";

function ModifyStatus({currentStatus, orderId, existingTrackingId}) {
    const validStatuses = ['paid', 'on delivery', 'shipped', 'cancelled'];

    const [status, setStatus] = useState(currentStatus);
    const [trackingId, setTrackingId] = useState(existingTrackingId || '');
    const [isPending, startTransition] = useTransition();

    const handleChange = (e) => {
        const newStatus = e.target.value;
        let generatedTrackingId = trackingId;

        if (newStatus === 'on delivery' && !trackingId) {
            generatedTrackingId = 'AWB-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            setTrackingId(generatedTrackingId);
        }

        // Optimistically update status
        setStatus(newStatus);

        // Wrap the async server action in a transition
        startTransition(async () => {
            const formData = new FormData();
            formData.append('order_id', orderId);
            formData.append('status', newStatus);
            if (newStatus === 'on delivery') {
                formData.append('tracking_id', generatedTrackingId);
            }

            try {
                await modifyStatus(formData);
            } catch (err) {
                console.error("Update failed:", err);
            }
        });
    };

    return (
        <form id={`status-form-${orderId}`}>
            <input type="hidden" name="order_id" value={orderId}/>

            <select
                name="status"
                value={status}
                onChange={handleChange}
                disabled={isPending}
            >
                {validStatuses.map((keyStatus) => (
                    <option key={keyStatus} value={keyStatus}>
                        {keyStatus}
                    </option>
                ))}
            </select>

            {status === 'on delivery' && trackingId && (
                <input type="hidden" name="tracking_id" value={trackingId}/>
            )}

            {isPending && <span style={{marginLeft: '8px'}}>Updating...</span>}
        </form>
    );
}

export default ModifyStatus;