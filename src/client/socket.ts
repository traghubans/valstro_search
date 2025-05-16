// Purpose: Creates and exports a configured Socket.io client instance

// Imports
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../types';

// Creates and exports a configured Socket.io client instance
export function createSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
    return io('http://localhost:3000', {
        transports: ['websocket']
    });
} 