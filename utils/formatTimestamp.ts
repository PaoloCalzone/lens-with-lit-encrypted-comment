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

function difference(timestamp) {
	const postDate: any = new Date(timestamp)
	const now: any = new Date()
	const difference = now.getTime() - postDate.getTime()
	return difference
}

function age(timestamp) {
	const diff = difference(timestamp)
	const days = 1000 * 3600 * 24
	const hours = 1000 * 3600
	const minutes = 1000 * 60

	if (Math.round(diff / days) > 1) return `${Math.round(diff / days)} days ago`
	else if (Math.round(diff / hours) > 24 && Math.round(diff / hours) < 1)
		return `${Math.round(diff / days)} hours ago`
	else Math.round(diff / minutes) > 24 && Math.round(diff / minutes) < 1
	return `${Math.round(diff / minutes)} minutes ago`
}

export { formatTimestamp, age }
