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
        path: 'favouriteBusinesses',
        populate: {
            path: 'review',
            populate: {
                path: 'user', select: 'username email _id profile'
            }
        }
    },
    {
        path: 'favouriteCities', select: '-touristSpot',
        populate: {
            path: 'review',
            populate: {
                path: 'user', select: 'username email _id profile'
            }
        }
    },
    {
        path: 'visitedCities',
        populate: [
            {
                path: 'touristSpot', select: '-city'
            },
            {
                path: 'review',
                populate: {
                    path: 'user', select: 'username email _id profile'
                }
            }
        ]
    },
    {
        path: "itineraries",
        populate: {
            path: "places.placeId",
        },
    },
    {
        path: 'notifications', select: "-user"
    }
]