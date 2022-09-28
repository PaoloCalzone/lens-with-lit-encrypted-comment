import { FC } from 'react'
import { GET_COMMENTS_OF } from '../../api/get-comments-of'
import { useQuery, gql } from '@apollo/client'
import lit from '../lib/lit'
import LitJsSdk from '@lit-protocol/sdk-browser'

const Comments: FC = () => {
	const { data, loading, error } = useQuery(gql(GET_COMMENTS_OF), {
		pollInterval: 500,
	})
	async function decrypt() {
		if (data) {
			const comments = data.publications.items

			const decryptedComments = await comments.map(async comment => {
				const attributes = comment.metadata.attributes[0]
				if (attributes && attributes.traitType === 'encrypted') {
					try {
						const ipfsUrl = comment.metadata.attributes[0].value
						const response = await fetch(ipfsUrl)
						const jsonLit = await response.json()
						console.log('Fetched URL response is:', jsonLit)
						console.log('KEY:', jsonLit.litKkey)
						console.log('COMMENT', jsonLit.litComment)
						const blob = LitJsSdk.base64StringToBlob(jsonLit.litComment)
						const message = await lit.decryptString(blob, jsonLit.litKkey)
						console.log('decrypted Message', message)
						return message
					} catch (err) {
						console.log(err)
					}
				} else {
					return comment.metadata.content
				}
			})
			console.log('@@@@@@@@@@@@@@@@@@@Array of all messages:', decryptedComments)
		}
	}
	decrypt()

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
				{data &&
					data.publications.items.map(comment => (
						<li key={comment.metadata.createdAt}>
							<div className="my-4">{comment.metadata.content} </div>
						</li>
					))}
			</ul>
		</div>
	)
}

export default Comments
