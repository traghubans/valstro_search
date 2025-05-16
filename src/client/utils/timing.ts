// Purpose: Handles timing calculations for search operations

// Calculates the duration of a search operation
export const calculateDuration = (startTime: number | null): string => {
    if (!startTime) return '0.0';
    const duration = (Date.now() - startTime) / 1000;
    return duration.toFixed(1);
};

// Gets the current timestamp in a readable format
export const getCurrentTimestamp = (): string => {
    return new Date().toLocaleTimeString();
}; 