/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			'avatars.dicebear.com',
			'lens.infura-ipfs.io',
			'ipfs.io',
			'avatar.tobi.sh',
			'prnts.mypinata.cloud',
			'res.cloudinary.com',
			'statics-mumbai-lens-staging.s3.eu-west-1.amazonaws.com',
			'qmbisvbat1maklvze2vb82ab1stdb4eba4j2toelvctmwn',
			'bafybeiheutsyevwnjz764e52uyzwlbfws6wo4adgxez6uq37zbrnk35jw4.ipfs.dweb.link',
		],
	},
}

module.exports = nextConfig
