import getCurrentUser from '@/app/actions/getCurrentUser'
import getListingById from '@/app/actions/getListingById'
import ClientOnly from '@/app/components/ClientOnly'
import EmptyState from '@/app/components/EmptyState'
import ListingClient from './ListingClient'
import getReservations from '@/app/actions/getReservations'

interface IParams {
    listingId: string  // listingId should be a string
}

const ListingPage = async ({ params }: { params: IParams }) => {
    const { listingId } = params;  // Ensure listingId is a string

    if (!listingId) {
        // Handle case when listingId is not available
        return <EmptyState />;
    }

    const listing = await getListingById({ listingId });  // Pass the correct shape for params
    const reservations = await getReservations({ listingId });  // Pass listingId to getReservations
    const currentUser = await getCurrentUser()

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ListingPage
