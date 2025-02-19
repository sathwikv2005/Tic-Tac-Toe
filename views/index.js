document.querySelectorAll('.box').forEach((box) => {
	box.addEventListener('click', () => {
		handleBoxClick(box.id)
	})
})

let turnDisplay = document.getElementById('turn')

let turn = 'X'

function handleBoxClick(boxId) {
	console.log('Clicked:', boxId)
	const box = document.getElementById(boxId)
	if (box.classList.contains('occupied')) {
		var audio = new Audio('/occupied.mp3')
		audio.volume = 0.4
		audio.play()
		return
	}
	box.classList.add('occupied')
	box.innerHTML = turn
	var audio = new Audio('/clicked.mp3')
	audio.volume = 0.5
	audio.play()
	checkWin(boxId)
	turn = turn == 'X' ? 'O' : 'X'
	turnDisplay.innerHTML = turn
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
		addOccupied()
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
			addOccupied()
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
			addOccupied()
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
			addOccupied()
			box1.classList.add('win--dia2')
			box2.classList.add('win--dia2')
			box3.classList.add('win--dia2')
		}
	}

	return win
}

function addOccupied() {
	document.querySelectorAll('.box').forEach((box) => {
		box.classList.add('occupied')
	})
}

function removeOccupied() {
	document.querySelectorAll('.box').forEach((box) => {
		box.classList.remove('occupied')
	})
}

function reset() {
	document.querySelectorAll('.box').forEach((box) => {
		box.innerHTML = ''
		box.classList.remove('occupied')
		box.classList.remove('win--col')
		box.classList.remove('win--dia1')
		box.classList.remove('win--dia2')
	})
	document.querySelectorAll('.row').forEach((box) => {
		box.classList.remove('win--row')
	})
	turn = 'X'
	turnDisplay.innerHTML = turn
}
