# Tic-Tac-Toe

A simple yet engaging Tic-Tac-Toe game with both **Local Multiplayer** and **Online Multiplayer** modes. Play with a friend on the same device or challenge opponents online!

## Features

- 🎮 **Local Multiplayer:** Play against a friend on the same device.
- 🌍 **Online Multiplayer:** Create or join rooms and compete with players online.
- 🎨 **Sleek UI:** Simple and intuitive interface for an enjoyable experience.
- ⚡ **Real-time Gameplay:** Powered by **Socket.IO** for seamless online interaction.
- 📊 **Win Tracking:** Keep track of wins for both players in online mode.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB (for storing game data and rooms)

## Installation

### Clone the Repository

```sh
git https://github.com/sathwikv2005/Tic-Tac-Toe.git
cd Tic-Tac-Toe
```

### Install Dependencies

```sh
npm install
```

### Start the Server

```sh
npm start
(or)
node index.js
```

### Run the Frontend (if applicable)

Serve the `index.html` file through a local server or open it directly in the browser.

## How to Play

### Local Multiplayer

1. Open the game in a browser.
2. Click on a box to make a move.
3. Players take turns until one wins or the board is full.

### Online Multiplayer

1. One player creates a room.
2. The second player joins using the room ID.
3. Players take turns until a winner is determined.
