import { SuccessResponse, ErrorResponse } from '../../types';

// Formats and displays a search result 
export const displaySearchResult = (result: SuccessResponse, timestamp: string): void => {
    console.log(`${result.page}/${result.resultCount} ${result.name} - [${result.films.join(', ')}]`);
};

// Displays an error message
export const displayError = (error: string): void => {
    console.error(`Error: ${error}`);
};

// Displays a search start message  
export const displaySearchStart = (query: string, resultCount: number): void => {
    console.log(`\nStarting search for '${query}' (expecting ${resultCount} results)...`);
};

// Displays a search complete message
export const displaySearchComplete = (query: string, duration: string): void => {
    console.log(`\nSearch complete for '${query}' (took ${duration}s)\n`);
};

// Displays connection status
export const displayConnectionStatus = (isConnected: boolean): void => {
    console.log(isConnected ? 'Connected to server' : 'Disconnected from server');
};

// Displays connection error
export const displayConnectionError = (error: Error): void => {
    console.error(`Connection error: ${error.message}`);
};

// Displays a prompt for user input
export const displaySearchPrompt = (): string => {
    return 'Enter character name to search (or "quit" to exit): ';
}; 