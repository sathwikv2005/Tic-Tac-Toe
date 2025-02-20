const mongo = require('../mongo')

const playerSchema = new mongo.Schema({
	userName: { type: String, required: true },
	wins: { type: Number, default: 0 },
})

const gameSchema = new mongo.Schema({
	roomID: { type: String, required: true },
	player1: { type: playerSchema, required: true },
	player2: { type: playerSchema, default: { userName: 'player2', wins: 0 } },
	createdAt: { type: Date, default: Date.now, expires: 7200 },
})

const game = mongo.model('Game', gameSchema)

module.exports = game
