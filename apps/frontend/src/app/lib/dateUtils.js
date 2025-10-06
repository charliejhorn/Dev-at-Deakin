export function normalizeToDate(value) {
    if (value === null || value === undefined) return null;

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const numericValue =
        typeof value === "string" && value.trim() !== ""
            ? Number(value)
            : value;

    if (typeof numericValue !== "number" || Number.isNaN(numericValue)) {
        return null;
    }

    const date = new Date(numericValue);
    return Number.isNaN(date.getTime()) ? null : date;
}

function pad(value) {
    return String(value).padStart(2, "0");
}

export function formatDateTime(value) {
    const date = normalizeToDate(value);
    if (!date) return "";

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatDateOnly(value) {
    const date = normalizeToDate(value);
    if (!date) return "";

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
}
