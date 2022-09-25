import { FC } from 'react'
import { GET_COMMENTS_OF } from '../../api/get-comments-of'
import { useQuery, gql } from '@apollo/client'

const Comments: FC = () => {
	const { data, loading, error } = useQuery(gql(GET_COMMENTS_OF), {
		variables: { commentsOf: '0x3f7d-0x03', limit: 10 },

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

	return <div></div>
}

export default Comments
