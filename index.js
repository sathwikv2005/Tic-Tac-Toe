require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 6700

app.use(express.static(__dirname + '/views'))

app.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname, '/views/index.html'))
})

app.listen(port, () => {
	console.log(`Server online on port: ${port}`)
})
