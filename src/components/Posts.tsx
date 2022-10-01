import { FC } from 'react'
import { GET_PUBLICATIONS } from '../../api/get-publications'
import { useQuery, gql } from '@apollo/client'

interface Props {
	postProfileId: string
}
const Posts: FC<Props> = ({ postProfileId }) => {
	const { data, loading, error } = useQuery(gql(GET_PUBLICATIONS), {
		variables: { request: { profileId: postProfileId, publicationTypes: 'POST', limit: 5 } },
	})
	console.log('Post component data:', data)
	const posts = data?.publications?.items || []
	console.log('POSTS', posts)
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
			{data && <h1 className="text-green-500">Posts from:{posts[0].profile.handle}</h1>}
			{data &&
				posts.map((post, index) => (
					<div key={index}>
						<div className="text-green-700">{post.metadata.content}</div>
					</div>
				))}
		</div>
	)
}

export default Posts
