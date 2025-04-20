import prisma from '@/app/libs/prismadb'

interface IParams {
    listingId?: string
    userId?: string
    authorId?: string
}

export default async function getReservations(params: IParams) {
    try {
        const { listingId, userId, authorId } = params

        // Build query conditionally based on the available parameters
        const query: any = {}

        if (listingId) {
            query.listingId = listingId
        }

        if (userId) {
            query.userId = userId
        }

        if (authorId) {
            // If authorId is provided, look for reservations where the listing's userId matches authorId
            query.listing = {
                userId: authorId
            }
        }

        // Fetch reservations with the constructed query
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true  // Include the listing details in the result
            },
            orderBy: {
                createdAt: 'desc'  // Sort by creation date, descending
            }
        })

        // Map over reservations to convert dates to ISO string format
        const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString()  // Format listing's createdAt date
            }
        }))

        return safeReservations
    } catch (error: any) {
        // Throw a more descriptive error message for easier debugging
        throw new Error(`Error fetching reservations: ${error.message}`)
    }
}
