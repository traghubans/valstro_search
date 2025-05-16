// Purpose: Handles the search functionality

// Imports 
import { ServerResponse, SuccessResponse, ErrorResponse, SearchState } from '../../types';
import { displaySearchResult, displayError, displaySearchStart, displaySearchComplete } from '../utils/display';
import { calculateDuration } from '../utils/timing';

// Validates the response format from the server
export const isValidResponse = (response: unknown): response is ServerResponse => {
    return typeof response === 'object' && response !== null && 
           ('name' in response || 'error' in response) &&
           'page' in response &&
           'resultCount' in response;
};

// Handles error responses from the server
export const handleErrorResponse = (
    result: ErrorResponse,
    searchState: SearchState,
    onReset: () => void,
    onPrompt: () => void
): void => {
    displayError(result.error);
    onReset();
    onPrompt();
};

// Initializes the search state with the first result
export const initializeSearchState = (
    result: SuccessResponse,
    searchState: SearchState,
    onUpdate: (state: SearchState) => void
): void => {
    const newState: SearchState = {
        ...searchState,
        isSearching: true,
        currentQuery: searchState.currentQuery,
        totalResults: result.resultCount,
        receivedPages: new Set(),
        startTime: Date.now()
    };
    onUpdate(newState);
    displaySearchStart(searchState.currentQuery, result.resultCount);
};

// Tracks and displays a single search result
export const trackAndDisplayResult = (
    result: SuccessResponse,
    searchState: SearchState,
    onUpdate: (state: SearchState) => void
): void => {
    const newPages = new Set(searchState.receivedPages);
    newPages.add(result.page);
    
    onUpdate({
        ...searchState,
        receivedPages: newPages
    });
    
    displaySearchResult(result, '');
};

// Checks if the search is complete and handles completion if so
export const checkSearchCompletion = (
    result: SuccessResponse,
    searchState: SearchState,
    onComplete: () => void
): void => {
    if (result.page === result.resultCount) {
        onComplete();
    }
};

// Handles search completion
export const handleSearchComplete = (
    searchState: SearchState,
    onReset: () => void,
    onPrompt: () => void
): void => {
    const duration = calculateDuration(searchState.startTime);
    displaySearchComplete(searchState.currentQuery, duration);
    onReset();
    onPrompt();
}; 