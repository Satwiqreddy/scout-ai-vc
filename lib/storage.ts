'use client';

export const getStorageItem = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    try {
        return JSON.parse(saved);
    } catch (e) {
        return defaultValue;
    }
};

export const setStorageItem = (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const downloadCSV = (filename: string, data: any[]) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
        Object.values(row).map(val =>
            typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(',')
    ).join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
