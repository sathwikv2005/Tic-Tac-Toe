document.querySelectorAll('.box').forEach((box) => {
	box.addEventListener('click', () => {
		handleBoxClick(box.id)
	})
})

const resetBtn = document.getElementById('newGameBtn')

let gameOver = false

const roomID = window.location.pathname.split('/pvp/')[1]
console.log(roomID)
document.getElementById('roomID').innerHTML = roomID
let turnDisplay = document.getElementById('turn')

function getCookie(name) {
	const cookies = document.cookie.split('; ')
	for (let cookie of cookies) {
		const [key, value] = cookie.split('=')
		if (key === name) return value
	}
	return null
}

const userName = getCookie('username')

let player1 = 'player1'
let player2 = 'player2'

let client = userName

let turn = `${player1} (X)`

const port = window.location.port ? `:${window.location.port}` : ''
const socket = io(`${window.location.protocol}//${window.location.hostname}${port}`)

socket.on('connect', () => {
	console.log('Connected to server')
	load()
})

function load() {
	console.log('Load')
	socket.emit('joinRoom', { roomID, userName })
}

socket.on('gameState', (data) => {
	console.log('Game State:', data)
	player1 = data.player1
	player2 = data.player2

	// Display player names
	document.getElementById('player1').innerHTML = `${player1} (X)`
	document.getElementById('player2').innerHTML = `${player2} (O)`

	// Display win counts
	document.getElementById('player1wins').innerHTML = `${data.player1Wins || 0}`
	document.getElementById('player2wins').innerHTML = `${data.player2Wins || 0}`

	turn = `${data.turn} (${data.turn === player1 ? 'X' : 'O'})`
	console.log(turn.split(' (')[0])
	if (client !== turn.split(' (')[0]) {
		addBlocked()
	}
	if (data.turn === player1) {
		document.getElementById('player1').classList.add('active')
		document.getElementById('player2').classList.remove('active')
	} else {
		document.getElementById('player1').classList.remove('active')
		document.getElementById('player2').classList.add('active')
	}
	gameOver = data.winner ? true : false
	if (!gameOver) resetBtn.style.display = 'none'
	updateBoardUI(data.board)
})

function showNotification(message) {
	const container = document.getElementById('notification-container')

	const notification = document.createElement('div')
	notification.classList.add('notification')

	notification.innerHTML = `
        <span>${message}</span>
        <button onclick="closeNotification(this)">✖</button>
    `

	container.appendChild(notification)

	setTimeout(() => {
		closeNotification(notification)
	}, 5000)
}

function closeNotification(element) {
	element.style.animation = 'fadeOut 0.3s ease-in-out'
	setTimeout(() => element.remove(), 200)
}

socket.on('message', (msg) => {
	showNotification(msg)
})

socket.on('gameOver', (data) => {
	console.log(data)
	gameOver = true
	if (userName == player1) resetBtn.style.display = 'block'
	addBlocked()
	document.getElementById('player1wins').innerHTML = `${data.player1Wins || 0}`
	document.getElementById('player2wins').innerHTML = `${data.player2Wins || 0}`
	showNotification(`${data.winner} has won the game.`)
})

socket.on('reset', (msg) => {
	document.querySelectorAll('.box').forEach((box) => {
		box.innerHTML = ''
		box.classList.remove('occupied')
		box.classList.remove('blocked')
		box.classList.remove('win--col')
		box.classList.remove('win--dia1')
		box.classList.remove('win--dia2')
	})
	document.querySelectorAll('.row').forEach((box) => {
		box.classList.remove('win--row')
	})
	showNotification(msg)
})

socket.on('updateBoard', (data) => {
	console.log('Updated Board:', data)
	updateBoardUI(data.board)
	if (data.winner) {
		showNotification(`${data.winner} has won!`)
	}
	// Update turn display
	turn = data.turn === player1 ? `${player1} (X)` : `${player2} (O)`
	if (data.turn === player1) {
		document.getElementById('player1').classList.add('active')
		document.getElementById('player2').classList.remove('active')
	} else {
		document.getElementById('player1').classList.remove('active')
		document.getElementById('player2').classList.add('active')
	}

	// Update win counts if game has a winner
	if (data.winner) {
		document.getElementById('player1Wins').innerHTML = `Wins: ${data.player1Wins || 0}`
		document.getElementById('player2Wins').innerHTML = `Wins: ${data.player2Wins || 0}`
	}
	if (client === turn.split(' (')[0]) {
		removeBlocked()
	}
})

function handleBoxClick(boxId) {
	const box = document.getElementById(boxId)

	if (box.classList.contains('occupied') || box.classList.contains('blocked')) {
		var audio = new Audio('/occupied.mp3')
		audio.volume = 0.4
		audio.play()
		return
	}
	if (document.getElementById('player2').classList.contains('active')) {
		document.getElementById('player1').classList.add('active')
		document.getElementById('player2').classList.remove('active')
	} else {
		document.getElementById('player1').classList.remove('active')
		document.getElementById('player2').classList.add('active')
	}
	box.classList.add('occupied')
	box.innerHTML = turn.includes('(X)') ? 'X' : 'O'
	var audio = new Audio('/clicked.mp3')
	audio.volume = 0.5
	audio.play()
	addBlocked()
	checkWin(boxId)
	socket.emit('makeMove', { roomID, move: boxId })
}

function updateBoardUI(board) {
	for (let i = 0; i < 9; i++) {
		const box = document.getElementById(`box${Math.floor(i / 3) + 1}${(i % 3) + 1}`)
		box.innerHTML = board[i] ? board[i] : ''
		box.classList.toggle('occupied', board[i] !== null)
	}
	checkWinBoard(board)
}

function addBlocked() {
	document.querySelectorAll('.box').forEach((box) => {
		box.classList.add('blocked')
	})
}

function removeBlocked() {
	document.querySelectorAll('.box').forEach((box) => {
		box.classList.remove('blocked')
	})
}

function checkWin(boxId) {
	const id = boxId.split('box')[1]
	const idarr = id.split('')
	const row = idarr[0]
	const col = idarr[1]
	let win = false
	var winBy = -1
	//check row
	var box1 = document.getElementById(`box${row}${1}`)
	var box2 = document.getElementById(`box${row}${2}`)
	var box3 = document.getElementById(`box${row}${3}`)
	console.log(box3.innerHTML)
	win =
		box1.innerHTML == box2.innerHTML &&
		box2.innerHTML == box3.innerHTML &&
		box1.innerHTML != '' &&
		box2.innerHTML != '' &&
		box3.innerHTML != ''
	if (win) {
		winBy = 0
		addBlocked()
		const rowele = document.getElementsByClassName(`row${row}`)[0]
		rowele.classList.add('win--row')
	}

	//check col
	if (!win) {
		var box1 = document.getElementById(`box${1}${col}`)
		var box2 = document.getElementById(`box${2}${col}`)
		var box3 = document.getElementById(`box${3}${col}`)
		win =
			box1.innerHTML == box2.innerHTML &&
			box2.innerHTML == box3.innerHTML &&
			box1.innerHTML != '' &&
			box2.innerHTML != '' &&
			box3.innerHTML != ''
		if (win) {
			winBy = 1
			addBlocked()
			box1.classList.add('win--col')
			box2.classList.add('win--col')
			box3.classList.add('win--col')
		}
	}

	//check diagonals
	if (!win && row == col) {
		var box1 = document.getElementById(`box11`)
		var box2 = document.getElementById(`box22`)
		var box3 = document.getElementById(`box33`)
		win =
			box1.innerHTML == box2.innerHTML &&
			box2.innerHTML == box3.innerHTML &&
			box1.innerHTML != '' &&
			box2.innerHTML != '' &&
			box3.innerHTML != ''
		if (win) {
			winBy = 3
			addBlocked()
			box1.classList.add('win--dia1')
			box2.classList.add('win--dia1')
			box3.classList.add('win--dia1')
		}
	}
	if (!win) {
		var box1 = document.getElementById(`box13`)
		var box2 = document.getElementById(`box22`)
		var box3 = document.getElementById(`box31`)
		win =
			box1.innerHTML == box2.innerHTML &&
			box2.innerHTML == box3.innerHTML &&
			box1.innerHTML != '' &&
			box2.innerHTML != '' &&
			box3.innerHTML != ''
		if (win) {
			winBy = 4
			addBlocked()
			box1.classList.add('win--dia2')
			box2.classList.add('win--dia2')
			box3.classList.add('win--dia2')
		}
	}

	return win
}

function checkWinBoard(board) {
	const size = 3
	let win = false
	let winBy = -1
	let winningCombo = []

	// Check rows
	for (let row = 0; row < size; row++) {
		const start = row * size
		if (board[start] && board[start] === board[start + 1] && board[start] === board[start + 2]) {
			win = true
			winBy = 0
			winningCombo = [start, start + 1, start + 2]

			document.querySelector(`.row${row + 1}`).classList.add('win--row')
			break
		}
	}

	// Check columns
	if (!win) {
		for (let col = 0; col < size; col++) {
			if (board[col] && board[col] === board[col + size] && board[col] === board[col + 2 * size]) {
				win = true
				winBy = 1
				winningCombo = [col, col + size, col + 2 * size]

				document.getElementById(`box1${col + 1}`).classList.add('win--col')
				document.getElementById(`box2${col + 1}`).classList.add('win--col')
				document.getElementById(`box3${col + 1}`).classList.add('win--col')
				break
			}
		}
	}

	// Check main diagonal
	if (!win && board[0] && board[0] === board[4] && board[0] === board[8]) {
		win = true
		winBy = 3
		winningCombo = [0, 4, 8]

		document.getElementById('box11').classList.add('win--dia1')
		document.getElementById('box22').classList.add('win--dia1')
		document.getElementById('box33').classList.add('win--dia1')
	}

	// Check anti-diagonal
	if (!win && board[2] && board[2] === board[4] && board[2] === board[6]) {
		win = true
		winBy = 4
		winningCombo = [2, 4, 6]

		document.getElementById('box13').classList.add('win--dia2')
		document.getElementById('box22').classList.add('win--dia2')
		document.getElementById('box31').classList.add('win--dia2')
	}

	if (win) {
		winningCombo.forEach((index) => {
			document
				.getElementById(`box${Math.floor(index / 3) + 1}${(index % 3) + 1}`)
				.classList.add('win')
		})
	}

	return win
}

function reset() {
	socket.emit('reset', { roomID, userName })
}
