function getCookie(name) {
	const cookies = document.cookie.split('; ')
	for (let cookie of cookies) {
		const [key, value] = cookie.split('=')
		if (key === name) return value
	}
	return null
}

let savedName = getCookie('username')

document.getElementById('pvpUserName').value = savedName
	? savedName
	: `GuestUser${Math.floor(Math.random() * 100000 + 1)}`

function setLoading() {
	document.querySelectorAll('.pvp--btn').forEach((btn) => (btn.disabled = true))
	document.body.style.opacity = '0.5'
}

function clearLoading() {
	document.querySelectorAll('.pvp--btn').forEach((btn) => (btn.disabled = false))
	document.body.style.opacity = '1'
}

async function create() {
	const userName = document.getElementById('pvpUserName').value
	if (!/^[a-zA-Z0-9_]+$/.test(userName))
		return alert('User Name can only contain alphabets, numbers and _')
	setLoading()
	console.log(JSON.stringify({ userName }))
	const responce = await fetch('/api/pvp/create', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({ userName }),
	})
	const data = await responce.json()
	const roomID = data.roomID
	clearLoading()
	console.log(roomID)
	document.cookie = `username=${userName}; path=/;`
	window.location = `/pvp/${roomID}`
}

function join() {
	const roomID = document.getElementById('roomID').value
	const userName = document.getElementById('pvpUserName').value
	document.cookie = `username=${userName}; path=/;`
	window.location = `/pvp/${roomID}`
}
