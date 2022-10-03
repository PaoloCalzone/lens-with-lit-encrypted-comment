function formatTimestamp(timestamp: string) {
	const postDate = new Date(timestamp)
	console.log('Eventdate', postDate)
	//const now = Date.now()
	//console.log('Now', now)

	const postDateStr = `${postDate.toLocaleString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	})}`
	return postDateStr
}

function postAge(timestamp: string) {
	const postDate: any = new Date(timestamp)
	const now: any = new Date()
	console.log('now', now)
	const difference = now.getTime() - postDate.getTime()
	const age = Math.round(difference / (1000 * 3600 * 24))
	console.log('post age', age)
	return age > 1 ? age : null
}
export { formatTimestamp, postAge }
