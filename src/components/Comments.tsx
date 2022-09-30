import { FC, useEffect, useState } from 'react'
import { GET_COMMENTS_OF } from '../../api/get-comments-of'
import { useQuery, gql } from '@apollo/client'
import lit from '../lib/lit'
import LitJsSdk from '@lit-protocol/sdk-browser'

interface Props {
	profile: string
}

const Comments: FC<Props> = ({ profile }) => {
	const { data, loading, error } = useQuery(gql(GET_COMMENTS_OF), {
		pollInterval: 500,
	})
	const [comments, setComments] = useState([])

	useEffect(() => {
		if (data) {
			async function fetchComments() {
				const fetchedComments = await decrypt()
				setComments(fetchedComments)
			}
			fetchComments().catch(console.error)
		}
	}, [data])

	async function decrypt() {
		if (data) {
			const comments = data.publications.items
			let decryptedComments = await Promise.all(
				comments.map(async comment => {
					const attributes = comment.metadata.attributes[0]
					if (attributes && attributes.traitType === 'encrypted') {
						try {
							const ipfsUrl = comment.metadata.attributes[0].value
							const response = await fetch(ipfsUrl)
							const jsonLit = await response.json()
							const blob = LitJsSdk.base64StringToBlob(jsonLit.litComment)
							const message = await lit.decryptString(
								blob,
								jsonLit.litKkey,
								'0x7e9DbDf5D10D64b597248E99194Ef715ACD88E52'
							)
							const decrypted = message.decryptedFile
							return decrypted
						} catch (err) {
							console.log(err)
						}
					} else {
						return comment.metadata.content
					}
				})
			)
			return decryptedComments
		}
	}

	console.log('Comments component data', data)
	if (loading)
		return (
			<div>
				<p>Loading...</p>
			</div>
		)
	if (error)
		return (
			<div>
				<p>`Error! ${error.message}`</p>
			</div>
		)

	return (
		<div>
			<ul role="list" className="">
				{comments && comments.map((comment, index) => <li key={index}>{comment}</li>)}
			</ul>
		</div>
	)
}

export default Comments
