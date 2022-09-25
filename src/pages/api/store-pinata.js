import { create } from 'ipfs-http-client'
import pinataSDK from '@pinata/sdk'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		console.log('REQUEST', req.body)
		return uploadPinata(req, res)
	} else {
		return res.status(405).json({ message: 'Method not allowed', success: false })
	}
}
const key = process.env.PINATA_KEY
const secret = process.env.PINATA_SECRET

if (!key || !secret) {
	throw new Error('Must define INFURA_PROJECT_ID and INFURA_SECRET in the .env to run this')
}

const pinataClient = pinataSDK(key, secret)

const uploadPinata = async (req, res) => {
	console.log('REQUEST FORMAT', req)
	const data = req.body
	const options = {}
	console.log('DATA', data)
	let uri
	const test = await pinataClient
		.pinJSONToIPFS(data, options)
		.then(result => {
			uri = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
			console.log('URI', uri)
		})
		.catch(err => {
			//handle error here
			console.log(err)
		})
	console.log('PINATA TEST ATUH', test)
	/* const result = await client.add(JSON.stringify(req.body))

	console.log('upload result ipfs', result.path) */
	return res.status(200).json({ success: true, cid: 'poinnnnn' })
}
