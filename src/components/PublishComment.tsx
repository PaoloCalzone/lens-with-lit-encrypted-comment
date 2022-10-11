import { FC, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { createCID } from 'utils/createCid'
import { createCommentTypedData } from '../../api/create-comment-typed-data'
import LENSHUB from '../../abi/lenshub.json'
import { setLitEncryptedKey } from 'utils/state'
import { useUserProfile } from '../store/userProfile'
import { usePublication } from '../store/publication'
import Spinner from './Spinner'
import lit from '../lib/lit'
import LitJsSdk from '@lit-protocol/sdk-browser'
import omitDeep from 'omit-deep'

const PublishComment: FC = () => {
	const userProfile = useUserProfile(state => state.userProfile)
	const publication = usePublication(state => state.publication)
	const [comment, setComment] = useState('')
	//const [encryptedComment, setEncryptedComment] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [encryption, setEncryption] = useState(false)

	const LENS_HUB_CONTRACT_ADDRESS = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
	async function encryptComment(comment) {
		if (encryption) {
			try {
				const { encryptedFile, encryptedSymmetricKey } = await lit.encryptString(
					comment,
					'0x7e9DbDf5D10D64b597248E99194Ef715ACD88E52',
					'0x41572A31bb185167dF5DdE27f7808483a5c9F085'
				)
				// Convert a Blob to a base64urlpad string. Note: This function returns a promise.
				const encryptedComment = await LitJsSdk.blobToBase64String(encryptedFile)
				return { encryptedComment, encryptedSymmetricKey }
			} catch (err) {
				console.log('Error during encryption', err)
			}
		}
	}

	async function handleSubmit(e) {
		e.preventDefault()
		setSubmitting(true)
		console.log('Comment', comment)

		let pinataUri
		let contentUri
		let encryptedComment

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(LENS_HUB_CONTRACT_ADDRESS, LENSHUB, signer)

		if (!userProfile.id) {
			console.log('No profile detected...')
			return
		}

		// 1. Encrypt comment with Lit
		if (encryption) {
			console.log('Encryption', encryption)
			const litResponse = await encryptComment(comment)
			// console.log('LitResponse:', litResponse)
			encryptedComment = litResponse.encryptedComment
			const encryptedKey = litResponse.encryptedSymmetricKey

			// 2. Store encrypted File and encrypted Key on Pinata and retrieve encryptionURI

			const body = {
				litComment: encryptedComment,
				litKkey: encryptedKey,
			}
			try {
				const response = await fetch('/api/store-pinata', {
					method: 'POST',
					headers: { 'Content-type': 'application/json' },
					body: JSON.stringify(body),
				})

				if (response.status !== 200) {
					alert('Something went wrong while creating CID')
				} else {
					let responseJSON = await response.json()
					pinataUri = responseJSON.uri
					console.log('Pinata URI', pinataUri)
				}
			} catch (err) {
				console.log('Error while uploading to pinata', err)
			}
		}

		// 3. Store Lens  metaData on IPFS and retrieve contentURI

		const postComment = encryption ? encryptedComment : comment
		console.log('EncryptedComment', postComment)
		const commentWithLink = `${postComment} This comment was encrypted. You can decrypt it here: https://some-url.xyz`
		console.log('Comment with Link', commentWithLink)
		contentUri = await createCID(commentWithLink, commentWithLink, userProfile.id, pinataUri)
		console.log('Create ipfs CID with lens metadata:', contentUri)

		// 5. Create typedData with Lens API

		const createCommentRequest = {
			profileId: userProfile.id,
			publicationId: publication[0].id,
			contentURI: contentUri,
			collectModule: {
				revertCollectModule: true,
			},
			referenceModule: {
				followerOnlyReferenceModule: false,
			},
		}
		const result = await createCommentTypedData(createCommentRequest)
		const typedData = result.data.createCommentTypedData.typedData
		console.log('typedData', typedData)

		// 6. Send Comment to Lens Contract

		const signature = await signer._signTypedData(
			omitDeep(typedData.domain, '__typename'),
			omitDeep(typedData.types, '__typename'),
			omitDeep(typedData.value, '__typename')
		)

		console.log('Signature', signature)
		const { v, r, s } = await ethers.utils.splitSignature(signature)

		const tx = await contract.commentWithSig({
			profileId: typedData.value.profileId,
			contentURI: typedData.value.contentURI,
			profileIdPointed: typedData.value.profileIdPointed,
			pubIdPointed: typedData.value.pubIdPointed,
			referenceModuleData: typedData.value.referenceModuleData,
			collectModule: typedData.value.collectModule,
			collectModuleInitData: typedData.value.collectModuleInitData,
			referenceModule: typedData.value.referenceModule,
			referenceModuleInitData: typedData.value.referenceModuleInitData,
			sig: {
				v,
				r,
				s,
				deadline: typedData.value.deadline,
			},
		})
		console.log(tx.hash)
		setSubmitting(false)
	}

	return (
		<div className="">
			<form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
				{' '}
				<div className="mt-8 border-style border-1 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
					<label htmlFor="comment" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
						Event name
					</label>
					<input
						id="comment"
						name="comment"
						type="text"
						className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
						required
						value={comment}
						onChange={e => setComment(e.target.value)}
					/>
					<div>
						<label>
							<input type="checkbox" checked={encryption} onChange={() => setEncryption(!encryption)} />
							Send a private message
						</label>
						<button
							type="submit"
							className="flex   ml-3 w-40 py-2 px-8  border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							disabled={submitting}
						>
							{submitting ? <Spinner /> : ''}
							<span className="flex-1">Create</span>
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default PublishComment
