import LitJsSdk from '@lit-protocol/sdk-browser'

const client = new LitJsSdk.LitNodeClient()
// For all EVM compatible chain
const chain = 'mumbai'

const accessControlConditions = [
	{
		// check if the author of the post is in possession
		// of a specific wallet address
		// https://developer.litprotocol.com/AccessControlConditions/EVM/basicExamples
		contractAddress: '',
		standardContractType: '',
		chain,
		method: '',
		parameters: [':userAddress'],
		returnValueTest: {
			comparator: '=',
			// post author address
			value: process.env.NEXT_PUBLIC_ADDR_1,
		},
	},
	{ operator: 'or' },
	{
		contractAddress: '',
		standardContractType: '',
		chain: 'mumbai',
		method: '',
		parameters: [':userAddress'],
		returnValueTest: {
			comparator: '=',
			// comment author address
			value: process.env.NEXT_PUBLIC_ADDR_2,
		},
	},
]

class Lit {
	litNodeClient

	async connect() {
		try {
			await client.connect()
			this.litNodeClient = client
		} catch (err) {
			console.log('Error while connecting to Lit nodes', err)
		}
	}

	async encryptString(text) {
		if (!this.litNodeClient) {
			await this.connect()
		}
		const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
		const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text)
		console.log('encrypted string:', encryptedString)

		const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
			accessControlConditions: accessControlConditions,
			symmetricKey,
			authSig,
			chain,
		})

		return {
			encryptedFile: encryptedString,
			encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
		}
	}

	async decryptString(encryptedStr, encryptedSymmetricKey) {
		if (!this.litNodeClient) {
			await this.connect()
		}
		const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
		const symmetricKey = await this.litNodeClient.getEncryptionKey({
			accessControlConditions: accessControlConditions,
			toDecrypt: encryptedSymmetricKey,
			chain,
			authSig,
		})
		const decryptedFile = await LitJsSdk.decryptString(encryptedStr, symmetricKey)
		// eslint-disable-next-line no-console
		console.log({
			decryptedFile,
		})
		return { decryptedFile }
	}
}

export default new Lit()
