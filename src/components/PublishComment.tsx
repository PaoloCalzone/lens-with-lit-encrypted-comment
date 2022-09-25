import { FC, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { createCID } from 'utils/createCid'
import { createCommentTypedData } from '../../api/create-comment-typed-data'
import LENSHUB from '../../abi/lenshub.json'
import { setLitEncryptedKey } from 'utils/state'
import { KeyIcon } from '@heroicons/react/outline'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import Spinner from './Spinner'
import lit from '../lib/lit'
import LitJsSdk from '@lit-protocol/sdk-browser'
import prisma from '../lib/prisma'

import omitDeep from 'omit-deep'
import { isBooleanObject } from 'util/types'

interface ICommentProps {
	profile: string
	publicationId: string
}

const PublishComment: FC<ICommentProps> = (profile, publicationId: ICommentProps) => {
	const [comment, setComment] = useState('')
	const [encryptedComment, setEncryptedComment] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [encryption, setEncryption] = useState(Boolean)

	const LENS_HUB_CONTRACT_ADDRESS = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'

	console.log('ProfileId', profile)
	console.log('Publication Id', publicationId)

	async function encryptComment(comment) {
		if (encryption) {
			try {
				const { encryptedFile, encryptedSymmetricKey } = await lit.encryptString(comment)
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

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(LENS_HUB_CONTRACT_ADDRESS, LENSHUB, signer)

		if (!profile) {
			console.log('No profile detected...')
			return
		}

		// 1. Encrypt comment with Lit

		console.log('Encryption', encryption)
		const litResponse = await encryptComment(comment)
		console.log('LitResponse:', litResponse)
		const encryptedComment = litResponse.encryptedComment
		const encryptedKey = litResponse.encryptedSymmetricKey
		setEncryptedComment(encryptedComment)

		// 2. Store encryptedFile and Key on Pinata and retrieve encryptionURI

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
				console.log('***Pinata URI', pinataUri)
			}
		} catch (err) {
			console.log('Error while uploading to pinata', err)
		}

		// 3. Store Lens  metaData on IPFS and retrieve contentURI

		console.log('Encrypted Comment local', encryptedComment)
		contentUri = await createCID(encryptedComment, encryptedComment, profile)
		console.log('Create CID', contentUri)

		// 4. Store relation ipfs x lens on Prisma

		const prismaBody = {
			id: contentUri,
			uri: pinataUri,
		}
		try {
			const response = await fetch('/api/store-prisma', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(prismaBody),
			})

			if (response.status !== 200) {
				alert('Something went wrong while pushing with prisma')
			} else {
				let responseJSON = await response.json()

				console.log('PRSIMA RESPONSE', responseJSON)
			}
		} catch (err) {
			console.log('Error while uploading to pinata', err)
		}

		// 5. Create typedData with Lens API

		const createCommentRequest = {
			profileId: profile,
			publicationId: publicationId,
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

		return

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
						<button
							type="submit"
							className="flex   ml-3 w-40 py-2 px-8  border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							disabled={submitting}
						>
							{submitting ? <Spinner /> : ''}
							<span className="flex-1">Create</span>
						</button>
						<div onClick={() => setEncryption(true)}>
							Click on the key if you want to encrypt your message
							<KeyIcon />
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default PublishComment
