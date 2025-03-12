const express = require('express')
const app = express.Router()
const game = require('../schemas/game')

app.post('/pvp/create', async (req, res) => {
	const userName = req.body.userName
	if (!userName || !/^[a-zA-Z0-9_]+$/.test(userName))
		return res.status(400).json({ message: 'Bad User Name' })
	const randomPart = Math.floor(1e6 + Math.random() * 9e7) // Random number between 1M and 100M
	const roomID = (Date.now() + randomPart).toString(32)
	const obj = new game({
		roomID,
		player1: { userName },
	})
	await obj.save()
	return res.status(200).json({ roomID })
})

module.exports = app
