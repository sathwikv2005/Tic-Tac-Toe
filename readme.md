# Tic-Tac-Toe

Tic-Tac-Toe is a simple yet fun game that supports both local and online multiplayer modes. Play with your friends or challenge an opponent online!

## Features

- **Local Multiplayer:** Play with a friend on the same device.
- **Online Multiplayer:** Connect with players online using WebSockets.
- **Real-time Gameplay:** Smooth, real-time moves using Socket.io.
- **Persistent Game State:** Game data is stored in MongoDB.

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps

1. Clone the repository:
   ```sh
   git clone https://github.com/sathwikv2005/Tic-Tac-Toe.git
   cd Tic-Tac-Toe
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```sh
   MONGOURI=your_mongo_connection_string
   ```
4. Start the server:
   ```sh
   npm start
   ```
5. Open the frontend in your browser:
   ```
   http://localhost:6700
   ```

## Usage

- Open the game and select **Local PvP** to play with a friend on the same device.
- Select **Online PvP**, enter a room ID, and share it with a friend to play online.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
