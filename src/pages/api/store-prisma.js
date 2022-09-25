import prisma from '../../lib/prisma'

export default async function handler(req, res) {
	if (req.method === 'POST') {
		console.log('Trying to push data to prisma')
		const commentData = req.body
		console.log('Parsed data', commentData)
		const savedComment = await prisma.comment.create({ data: commentData })
		console.log('Saved data', savedComment)
		return res.status(200).json({ success: true, comment: savedComment })
	} else {
		return res.status(405).json({ message: 'Method not allowed', success: false })
	}
}
