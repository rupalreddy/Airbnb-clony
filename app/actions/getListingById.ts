import prisma from '@/app/libs/prismadb'

interface IParams {
    listingId: string  // Make listingId required (no longer optional)
}

export default async function getListingById(params: IParams) {
    try {
        const { listingId } = params

        if (!listingId) {
            throw new Error('Listing ID is required.')
        }

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true
            }
        })

        if (!listing) {
            return null
        }

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null
            }
        }
    } catch (error: any) {
        throw new Error(error)
    }
}
