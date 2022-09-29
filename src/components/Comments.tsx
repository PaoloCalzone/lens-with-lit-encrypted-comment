import { FC, useEffect, useState } from 'react'
import { GET_COMMENTS_OF } from '../../api/get-comments-of'
import { useQuery, gql } from '@apollo/client'
import lit from '../lib/lit'
import LitJsSdk from '@lit-protocol/sdk-browser'

const Comments: FC = () => {
	const { data, loading, error } = useQuery(gql(GET_COMMENTS_OF), {
		pollInterval: 500,
	})
	const [comments, setComments] = useState([])

	useEffect(() => {
		async function fetchComments() {
			const fetchedComments = await decrypt()
			setComments(fetchedComments)
		}
		fetchComments().catch(console.error)
	}, [])

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
							const message = await lit.decryptString(blob, jsonLit.litKkey)
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
				{comments &&
					comments.map(comment => (
						<li key={comment}>
							<div className="my-4">{comment} </div>
						</li>
					))}
			</ul>
		</div>
	)
}

export default Comments
