require('dotenv').config()
const express = require('express')
const app = express()
const apiRouter = require('./routes/api')
const path = require('path')
const gameSchema = require('./schemas/game')
const cookieParser = require('cookie-parser')
const mongo = require('./mongo')

const http = require('http')
const server = http.createServer(app)
const setupSocket = require('./socket')
setupSocket(server)

const port = process.env.PORT || 6700

app.use(express.json())
app.use(cookieParser())

app.use(express.static(__dirname + '/views'))

app.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname, '/views/index.html'))
})

app.use('/api', apiRouter)

app.get('/pvp', (req, res) => {
	return res.sendFile(path.join(__dirname, '/views/pvp.html'))
})

app.get('/pvp/:id', async (req, res) => {
	const roomID = req.params.id
	const room = await gameSchema.findOne({ roomID })
	let userName = req.cookies.username
	if (!userName) {
		userName = `GuestUser${Math.floor(Math.random() * 100000 + 1)}`
		res.cookie('username', userName)
	}
	if (!room)
		return res.send(`<script>alert('Game not found or expired'); window.location = '/';</script>`)
	if (
		room.player1.userName !== userName &&
		room.player2.userName !== 'player2' &&
		room.player2.userName !== userName
	)
		return res.send(
			`<script>alert('You are not part of the game.'); window.location = '/';</script>`
		)
	if (room.player1.userName !== userName && room.player2.userName === 'player2')
		await gameSchema.updateOne({ roomID }, { $set: { 'player2.userName': userName } })
	return res.sendFile(path.join(__dirname, '/views/board.html'))
})

server.listen(port, () => {
	console.log(`Server online on port: ${port}`)
})
