import { v4 as uuidv4 } from 'uuid'

export const createCID = async (description, content, name) => {
	const body = {
		version: '2.0.0',
		metadata_id: uuidv4(),
		description: description,
		content: content,
		locale: 'en',
		mainContentFocus: 'TEXT_ONLY',
		external_url: null,
		name: name,
		attributes: [{ displayType: 'string', traitType: 'Encrypted', value: 'https://somerandomIPFSURI' }],
		image: null,
		imageMimeType: null,
		media: [
			// {
			//   item: 'https://scx2.b-cdn.net/gfx/news/hires/2018/lion.jpg',
			//   // item: 'https://assets-global.website-files.com/5c38aa850637d1e7198ea850/5f4e173f16b537984687e39e_AAVE%20ARTICLE%20website%20main%201600x800.png',
			//   type: 'image/jpeg',
			// },
		],
		appId: 'lens-private-comment',
	}
	try {
		const response = await fetch('/api/store-data', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(body),
		})

		if (response.status !== 200) {
			alert('Something went wrong while creating CID')
		} else {
			let responseJSON = await response.json()
			const contentURI = `https://infura-ipfs.io/ipfs/${responseJSON.cid}`
			return contentURI
		}
	} catch (err) {
		console.log('Error while uploading to ipfs', err)
	}
}
