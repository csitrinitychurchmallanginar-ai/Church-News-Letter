export const getApiUrl = () => {
    // If VITE_API_URL is set, use it.
    // Otherwise, fallback to an empty string which means relative path (uses vite proxy locally)
    return import.meta.env.VITE_API_URL || '';
};
