import { FC } from 'react'
import { GET_PUBLICATION } from '../../api/get-publication'
import { useQuery, gql } from '@apollo/client'

const Comments: FC = () => {
	const { data, loading, error } = useQuery(gql(GET_PUBLICATION), {})
	console.log('Post component data:', data)
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
			<h1 className="text-green-500">Post from Paolo Calzone</h1>
			<div className="text-green-700">{data.publication.metadata.content}</div>
		</div>
	)
}

export default Comments
