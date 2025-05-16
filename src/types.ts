// Purpose: Defines the types for the application

// Response types from server
export interface SuccessResponse {
    name: string;
    films: string[];
    page: number;
    resultCount: number;
}

// Error response from server
export interface ErrorResponse {
    error: string;
    page: -1;
    resultCount: -1;
}

// Server response type
export type ServerResponse = SuccessResponse | ErrorResponse;

// Type guard functions
export function isSuccessResponse(response: ServerResponse): response is SuccessResponse {
    return 'name' in response && 'films' in response;
}

// Type guard function for error response
export function isErrorResponse(response: ServerResponse): response is ErrorResponse {
    return 'error' in response;
}

// Search state types
export interface SearchState {
    isSearching: boolean;
    currentQuery: string;
    totalResults: number;
    receivedPages: Set<number>;
    startTime: number | null;
}

// Event payload types
export interface SearchQuery {
    query: string;
}

// Socket event types
export interface ServerToClientEvents {
    search: (response: ServerResponse[]) => void;
}

// Client to server event types
export interface ClientToServerEvents {
    search: (query: SearchQuery) => void;
}

// Combined socket events type
export type SocketEvents = {
    [K in keyof ServerToClientEvents]: ServerToClientEvents[K];
} & {
    [K in keyof ClientToServerEvents]: ClientToServerEvents[K];
}; 