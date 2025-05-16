// Purpose: Client for handling character search operations via WebSocket

// Imports
import { createInterface, Interface } from 'readline';
import { Socket } from 'socket.io-client';
import { ServerResponse, SearchState, SearchQuery } from '../types';
import { createSocket } from './socket';
import { displayConnectionStatus, displayConnectionError, displaySearchPrompt } from './utils/display';
import {
    isValidResponse,
    handleErrorResponse,
    initializeSearchState,
    trackAndDisplayResult,
    checkSearchCompletion,
    handleSearchComplete
} from './handlers/search';

// Client for handling character search operations via WebSocket
export class SearchClient {
    private readonly socket: Socket;
    private readonly rl: Interface;
    private searchState: SearchState;

    constructor() {
        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.socket = createSocket();
        this.searchState = this.createState();
        this.setupHandlers();
    }

    // Creates or resets the search state
    private createState(query: string = ''): SearchState {
        return {
            isSearching: false,
            currentQuery: query,
            totalResults: 0,
            receivedPages: new Set(),
            startTime: null
        };
    }

    // Updates the search state with new values
    private updateState(updates: Partial<SearchState>): void {
        this.searchState = { ...this.searchState, ...updates };
    }

    // Resets the search state and prompts for new input
    private resetState(): void {
        this.updateState(this.createState());
        this.promptForSearch();
    }

    // Safely displays a message by pausing input
    private displayMessage(message: string, isError: boolean = false): void {
        this.rl.pause();
        if (isError) {
            console.error(message);
        } else {
            console.log(message);
        }
    }

    // Sets up all socket event handlers
    private setupHandlers(): void {
        // Connection handlers
        this.socket.on('connect', () => {
            this.displayMessage('Connected to server');
            this.resetState();
        });

        this.socket.on('disconnect', () => {
            this.displayMessage('Disconnected from server');
            this.updateState(this.createState());
        });

        // Search response handler
        this.socket.on('search', this.handleSearchResponse.bind(this));

        // Error handlers
        this.socket.on('connect_error', (error: Error) => {
            this.displayMessage(`Connection error: ${error.message}`, true);
            this.resetState();
        });

        // Process termination handlers
        process.on('SIGINT', this.cleanup.bind(this));
        process.on('SIGTERM', this.cleanup.bind(this));
    }

    // Validates and processes the search response from the server
    private handleSearchResponse(response: ServerResponse): void {
        try {
            if (!isValidResponse(response)) {
                this.displayMessage('Invalid response format from server', true);
                return;
            }

            if ('error' in response) {
                handleErrorResponse(
                    response,
                    this.searchState,
                    this.resetState.bind(this),
                    this.promptForSearch.bind(this)
                );
                return;
            }

            if (!this.searchState.isSearching) {
                initializeSearchState(
                    response,
                    this.searchState,
                    (state) => this.updateState(state)
                );
            }

            trackAndDisplayResult(
                response,
                this.searchState,
                (state) => this.updateState(state)
            );

            checkSearchCompletion(
                response,
                this.searchState,
                () => handleSearchComplete(
                    this.searchState,
                    this.resetState.bind(this),
                    this.promptForSearch.bind(this)
                )
            );
        } catch (error) {
            this.displayMessage(`Error processing search response: ${error}`, true);
            this.resetState();
        }
    }

    // Handles the search process
    private handleSearch(query: string): void {
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) {
            this.displayMessage('Please enter a valid character name');
            this.promptForSearch();
            return;
        }

        if (this.searchState.isSearching) {
            this.displayMessage('Previous search still in progress...');
            return;
        }

        this.updateState(this.createState(trimmedQuery));
        this.displayMessage(`Searching for: '${trimmedQuery}'...`);
        this.socket.emit('search', { query: trimmedQuery } as SearchQuery);
    }

    // Prompts the user for a search query
    private promptForSearch(): void {
        this.rl.resume();
        this.rl.question(displaySearchPrompt(), (answer) => {
            if (answer.toLowerCase() === 'quit') {
                this.cleanup();
                return;
            }

            this.handleSearch(answer);
        });
    }

    // Handles cleanup for both quit and termination
    private cleanup(): void {
        this.displayMessage('Closing connection...');
        this.updateState(this.createState());
        this.socket.disconnect();
        this.rl.close();
        process.exit(0);
    }
} 