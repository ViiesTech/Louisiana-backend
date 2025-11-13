export const getUserPopulate = [
    {
        path: 'cityReview', select: '-user',
        populate: {
            path: 'city', select: '_id name type description gallery'
        }
    },
    {
        path: 'businessReview', select: '-user',
        populate: {
            path: 'business', select: '_id name category description gallery'
        }
    },
    {
        path: 'favouriteBusinesses', select: '-review'
    },
    {
        path: 'favouriteCities', select: '-review -touristSpot'
    },
    {
        path: 'visitedCities', select: '-review -touristSpot'
    },
    {
        path: "itineraries",
        populate: {
            path: "places.placeId",
        },
    },
    {
        path:'notifications', select:"-user"
    }
]