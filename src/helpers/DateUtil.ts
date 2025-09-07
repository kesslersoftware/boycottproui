import { format, parseISO } from 'date-fns';

export const formatDateTime = (isoDateTime: string): string => {
    // Remove nanoseconds (anything after the second ".")
    const cleaned = isoDateTime.replace(/\.\d{3,}Z$/, 'Z');
    const parsed = parseISO(cleaned);
    return format(parsed, 'MMMM d, yyyy'); // e.g., "June 21, 2025 10:59 PM"
};
