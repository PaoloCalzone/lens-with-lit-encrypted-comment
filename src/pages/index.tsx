import { FC, useState } from 'react'
import { APP_NAME } from '@/lib/consts'
import ConnectWallet from '@/components/ConnectWallet'
import { login } from '../../api/login'
import { ShareIcon } from '@heroicons/react/outline'
import { apolloClient } from 'apollo-client'
import { gql } from '@apollo/client'
import { GET_PROFILES } from '../../api/get-profiles'
import { GET_PUBLICATIONS } from '../../api/get-publications'
import { usePostProfile } from '../store/postProfile'
import { useUserProfile } from '../store/userProfile'
import PublishComment from '../components/PublishComment'
import Comments from '../components/Comments'
import Posts from '../components/Posts'
import Search from '../components/Search'

const Home: FC = () => {
	//const postProfileId = '0x3f7d'
	const [account, setAccount] = useState(null)
	const [profile, setProfile] = useState(null)
	const [userProfile, setUserProfile] = useUserProfile(state => [state.userProfile, state.setUserProfile])
	const postProfile = usePostProfile(state => state.postProfile)

	async function lensLogin() {
		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		})
		const data = await login(accounts[0])
		if (data.authenticate.accessToken) setAccount(accounts[0])
		console.log('Address', accounts[0])
		const response = await apolloClient.query({
			query: gql(GET_PROFILES),
			variables: { request: { ownedBy: accounts[0] } },
		})
		setUserProfile(response.data.profiles.items[0])
	}
	async function handleSubmit(e) {
		e.preventDefault()
	}
	console.log('USER PRofile object', userProfile)
	console.log('post profile from index', postProfile)
	return (
		<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
			<div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
				<div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
					<h1 className="text-6xl font-bold dark:text-white">{APP_NAME}</h1>
				</div>
				<div className="">
					{/**THE REACT COMPONENT */}
					<div>
						<h1 className="text-lg my-8">
							<span className="text-2xl">1.</span> Connect your wallet, select{' '}
							<strong>Polygon Mumbai</strong> network and <strong>sign</strong> the transaction to be
							logged in.
						</h1>
						<div className="flex justify-end">
							<button
								className="bg-emerald-600 w-40 py-2 px-4 text-center border border-gray-300 rounded-full shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700"
								onClick={() => lensLogin()}
							>
								Login
							</button>
						</div>
					</div>
					<Search />
					{postProfile && <Posts postProfileId={postProfile.profileId} />}
				</div>

				<div className="flex justify-center mt-4 sm:items-center sm:justify-between">
					<div className="text-center text-sm text-gray-500 sm:text-left">
						<div className="flex items-center">
							<ShareIcon className="-mt-px w-5 h-5 text-gray-400" />

							<a href="https://twitter.com/m1guelpf" className="ml-1 underline">
								Share
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
