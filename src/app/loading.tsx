export default function Loading() {
    return (
        <div className="animate-pulse opacity-50">
            {/* Date header skeleton */}
            <div className="h-4 w-48 bg-[var(--notes-border)] mx-auto mt-12 mb-6 rounded"></div>

            <div className="max-w-[600px] md:ml-12 lg:ml-16 px-6 pb-6 md:pb-10">
                {/* Title skeleton */}
                <div className="h-8 w-64 bg-[var(--notes-border)] mb-8 rounded"></div>

                {/* Content paragraphs */}
                <div className="space-y-4">
                    <div className="h-4 w-full bg-[var(--notes-border)] rounded"></div>
                    <div className="h-4 w-[90%] bg-[var(--notes-border)] rounded"></div>
                    <div className="h-4 w-[95%] bg-[var(--notes-border)] rounded"></div>
                    <div className="h-4 w-[60%] bg-[var(--notes-border)] rounded"></div>
                </div>
            </div>
        </div>
    );
}
