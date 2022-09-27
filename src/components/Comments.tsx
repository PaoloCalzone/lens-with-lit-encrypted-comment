import { FC } from 'react'
import { GET_COMMENTS_OF } from '../../api/get-comments-of'
import { useQuery, gql } from '@apollo/client'

const Comments: FC = () => {
	let comments
	const { data, loading, error } = useQuery(gql(GET_COMMENTS_OF), {
		pollInterval: 500,
	})

	async function sortEncryptedComments(comments) {
		// for each comment, look up in db if it's encrypted
		for (let i = 0; i < comments.length; i++) {
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
		}
	}
	console.log('DATA', data)
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
