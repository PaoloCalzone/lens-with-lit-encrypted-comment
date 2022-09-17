import { FC, useState } from 'react'
import { APP_NAME } from '@/lib/consts'
import ConnectWallet from '@/components/ConnectWallet'
import { BookOpenIcon, CodeIcon, ShareIcon } from '@heroicons/react/outline'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import lit from '../lib/lit'

const Home: FC = () => {
	const [encrypted, setEncrypted] = useState([])
	const [encryptedKey, setEncryptedKey] = useState([])

	async function decrypt() {
		try {
			const { decryptedFile } = await lit.decryptString(encrypted, encryptedKey)
			console.log('DECRYPTED BLABLABLA', decryptedFile)
		} catch (err) {
			console.log('Error during decrypting', err)
		}
	}
	async function handleSubmit(e) {
		e.preventDefault()

		try {
			const { encryptedFile, encryptedSymmetricKey } = await lit.encryptString()
			setEncrypted(encryptedFile)
			setEncryptedKey(encryptedSymmetricKey)
			console.log('Encyrpted *********', encryptedFile)
		} catch (err) {
			console.log('Error during encryption', err)
		}
		console.log('Encrypted message:', encrypted)
		console.log('encryptedKey', encryptedKey)
		console.log('Message submitted')
	}
	//decrypt()

	return (
		<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
			<div className="absolute top-6 right-6">
				<ConnectWallet />
			</div>
			<ThemeSwitcher className="absolute bottom-6 right-6" />
			<div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
				<div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
					<h1 className="text-6xl font-bold dark:text-white">{APP_NAME}</h1>
				</div>
				<div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
					{/**THE REACT COMPONENT */}
					<div>
						<button onClick={handleSubmit}>Private Message</button>
					</div>
					<div>
						<button onClick={decrypt}>Decrypt</button>
					</div>
				</div>

				<div className="flex justify-center mt-4 sm:items-center sm:justify-between">
					<div className="text-center text-sm text-gray-500 sm:text-left">
						<div className="flex items-center">
							<ShareIcon className="-mt-px w-5 h-5 text-gray-400" />

							<a href="https://twitter.com/m1guelpf" className="ml-1 underline">
								Share
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
