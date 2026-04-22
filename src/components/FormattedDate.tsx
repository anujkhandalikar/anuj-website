"use client";

import { useEffect, useState } from "react";

interface FormattedDateProps {
    date: string | Date;
    className?: string;
}

export default function FormattedDate({ date, className }: FormattedDateProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);


    if (!mounted) {
        // Return empty span with same class to maintain layout roughly, or nothing.
        // Returning nothing might cause layout shift.
        // Returning server date might cause flash of wrong time.
        // Given the user is annoyed by wrong time, let's return nothing or a placeholder.
        return <span className={className}>&nbsp;</span>;
    }

    const d = new Date(date);

    return (
        <span className={className}>
            {d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            })}
        </span>
    );
}
