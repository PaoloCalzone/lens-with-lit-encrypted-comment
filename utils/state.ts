let authenticationToken = null
export let setAuthenticationToken = token => {
	authenticationToken = token
	console.log('setAuthenticationToken: token', token)
}

export let getAuthenticationToken = () => {
	return authenticationToken
}

let litEncryptedKey = null

export let setLitEncryptedKey = key => {
	litEncryptedKey = key
	console.log('setEncryptedKey: key', key)
}

export let getEncryptedKey = () => {
	return litEncryptedKey
}
