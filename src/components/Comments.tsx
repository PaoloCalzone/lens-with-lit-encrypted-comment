import { FC } from 'react'
import { GET_COMMENTS_OF } from '../../api/get-comments-of'
import { useQuery, gql } from '@apollo/client'

const Comments: FC = () => {
	const { data, loading, error } = useQuery(gql(GET_COMMENTS_OF), {
		pollInterval: 500,
	})
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
