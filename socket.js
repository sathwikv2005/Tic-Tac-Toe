const { Server } = require('socket.io')
const gameSchema = require('./schemas/game')
const players = new Map() // Store players with socket IDs
const games = new Map() // Store game states

function setupSocket(server) {
	const io = new Server(server, {
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
		},
	})

	io.on('connection', (socket) => {
		socket.on('joinRoom', async ({ roomID, userName }) => {
			socket.join(roomID)
			players.set(socket.id, { roomID, userName })

			let gameData = games.get(roomID)
			if (!gameData) {
				const room = await gameSchema.findOne({ roomID })
				if (!room) return socket.emit('message', 'Game not found.')

				gameData = {
					board: Array(9).fill(null),
					turn: room.player1.userName,
					player1: room.player1.userName,
					player2: room.player2.userName,
					player1Wins: 0,
					player2Wins: 0,
					winner: null,
				}
				games.set(roomID, gameData)
			} else if (gameData.player2 === 'player2')
				gameData.player2 = (await gameSchema.findOne({ roomID })).player2.userName

			io.to(roomID).emit('gameState', gameData)
			socket.to(roomID).emit('message', `${userName} has joined the game.`)
		})

		socket.on('makeMove', async ({ roomID, move }) => {
			const gameData = games.get(roomID)
			if (!gameData) return socket.emit('message', 'Game not found.')

			const playerData = players.get(socket.id)
			if (!playerData || playerData.roomID !== roomID)
				return socket.emit('message', 'You are not part of this game.')

			const match = move.match(/^box(\d)(\d)$/)
			if (!match) return socket.emit('message', 'Invalid move format.')

			const row = parseInt(match[1]) - 1
			const col = parseInt(match[2]) - 1
			const index = row * 3 + col

			if (gameData.board[index] !== null || gameData.winner)
				return socket.emit('message', 'Invalid move.')

			if (gameData.turn !== playerData.userName)
				return socket.emit('message', "It's not your turn.")

			const symbol = gameData.turn === gameData.player1 ? 'X' : 'O'
			gameData.board[index] = symbol
			gameData.turn = gameData.turn === gameData.player1 ? gameData.player2 : gameData.player1
			gameData.lastMove = move
			io.to(roomID).emit('updateBoard', gameData)
			const winner = checkWinner(gameData.board, gameData)
			if (winner) {
				gameData.winner = winner
				if (gameData.player1 === winner) {
					gameData.player1Wins += 1
				} else {
					gameData.player2Wins += 1
				}
				io.to(roomID).emit('gameOver', gameData)

				const updateResult = await gameSchema.findOneAndUpdate(
					{ roomID },
					{
						$inc: {
							[playerData.userName === gameData.player1 ? 'player1.wins' : 'player2.wins']: 1,
						},
					},
					{ new: true }
				)
				gameData.player1Wins = updateResult.player1.wins
				gameData.player2Wins = updateResult.player2.wins
			}
		})

		socket.on('reset', async ({ roomID, userName }) => {
			const gameData = games.get(roomID)
			if (!gameData) return socket.emit('message', 'Game not found.')

			if (gameData.player1 !== userName)
				return socket.emit('message', 'Only player1 can reset the game.')

			gameData.board = Array(9).fill(null)
			gameData.turn = gameData.player1
			gameData.winner = null

			io.to(roomID).emit('gameState', gameData)
			io.to(roomID).emit('reset', 'Game has been reset.')
		})

		socket.on('disconnect', () => {
			const playerData = players.get(socket.id)
			if (playerData) {
				const { roomID, userName } = playerData
				socket.to(roomID).emit('message', `${userName} has disconnected.`)
				players.delete(socket.id)
			}
		})
	})

	function checkWinner(board, gameData) {
		const winningCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		]

		for (let combo of winningCombos) {
			const [a, b, c] = combo
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return board[a] === 'X' ? gameData.player1 : gameData.player2
			}
		}
		return null
	}
}

module.exports = setupSocket
