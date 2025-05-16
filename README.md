# Star Wars Character Search CLI

A TypeScript CLI application for searching Star Wars characters via a WebSocket API. Built for a take-home project to demonstrate event-driven API handling and real-time data streaming.

## Features

- Real-time search over WebSocket (Socket.io v4)
- Streams results with 250–1000ms simulated delay
- Handles errors and resets
- Formatted output: `1/3 Darth Vader – [A New Hope, ...]`

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **WebSocket**: Socket.IO v4 (client)
- **Container**: Docker (for backend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker (for running the backend)

### Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/traghubans/valstro_search.git>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend:
   ```bash
   docker run -p 3000:3000 aaronbate/socketio-backend
   ```

4. Start the CLI:
   ```bash
   npm run start
   ```

### Usage

1. The CLI will prompt you to enter a character name
2. Results will stream in real-time with formatted output
3. Type 'quit' to exit the application
4. Press Ctrl+C for graceful shutdown

## Project Structure

```
src/
├── index.ts              # Application entry point
├── client/
│   ├── SearchClient.ts   # Main client class
│   ├── socket.ts         # Socket.io client setup
│   ├── handlers/         # Event handlers
│   │   └── search.ts     # Search response handling
│   └── utils/           # Utility functions
│       ├── display.ts    # Output formatting
│       └── timing.ts     # Time calculations
├── types/               # TypeScript type definitions
└── mock/               # Fallback data
    └── starwars-people.json
```


## What I would do if I had more time
- Coloring the Console for easier readability
- Caching results 
- Better error handling, or a fallback mode with the cached data in the following cases
    - Server is unreachable
    - offline usage
- Unit tests and testable data
   - Specifically making unit tests for searching a known character, half a name ("luk"), and a character that doesn't exist
- Input Validation 

## Demo
https://github.com/user-attachments/assets/7ae3011c-b819-418b-aab2-ea2809dbd026

