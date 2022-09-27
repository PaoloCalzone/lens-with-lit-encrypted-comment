import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// GET /api/filter-comments
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
	const { commentProfileId, postProfileId } = req.query
	const resultPosts = await prisma.comment.findMany({
		where: {
			OR: [
				{
					commentProfileId: { contains: commentProfileId },
				},
				{
					postProfileId: { contains: postProfileId },
				},
			],
		},
	})
	res.json(resultPosts)
}
