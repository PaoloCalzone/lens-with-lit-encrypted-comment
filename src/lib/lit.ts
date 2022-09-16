import LitJsSdk from '@lit-protocol/sdk-browser'

const client = new LitJsSdk.LitNodeClient()
// For all EVM compatible chain
const chain = 'ethereum'
const accessControlConditionsNFT = {
	// LensHub Proxy (contract where NFTs are stored?)
	// Or we could simply check if the author of the post is in possession
	// of a specific wallet address ->
	// see https://developer.litprotocol.com/AccessControlConditions/EVM/basicExamples
	contractAddress: '0x60ae865ee4c725cd04353b5aab364553f56cef82',
	standardContractType: 'ERC721',
	chain,
	method: 'balanceOf',
	parameters: [':userAddress'],
	returnValueTest: {
		comparator: '>',
		value: '0',
	},
}

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

	async encryptString(str) {
		if (!this.litNodeClient) {
			await this.connect()
		}
		const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
		const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str)
		const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
			accessControlConditions: accessControlConditionsNFT,
			symmetricKey,
			authSig,
			chain,
		})
	}
}

export default new Lit()
