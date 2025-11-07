// import { City } from "../models/city";

// export const getCitiesSortedByRating = async () => {
//     const cities = await City.aggregate([
//         {
//             $lookup: {
//                 from: "cityreviews",
//                 localField: "review",
//                 foreignField: "_id",
//                 as: "review"
//             }
//         },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "review.user",
//                 foreignField: "_id",
//                 as: "users"
//             }
//         },
//         {
//             $addFields: {
//                 review: {
//                     $map: {
//                         input: "$review",
//                         as: "r",
//                         in: {
//                             _id: "$$r._id",
//                             rating: "$$r.rating",
//                             comment: "$$r.comment",
//                             createdAt: "$$r.createdAt",
//                             updatedAt: "$$r.updatedAt",
//                             user: {
//                                 $let: {
//                                     vars: {
//                                         matchedUser: {
//                                             $arrayElemAt: [
//                                                 {
//                                                     $filter: {
//                                                         input: "$users",
//                                                         as: "u",
//                                                         cond: { $eq: ["$$u._id", "$$r.user"] }
//                                                     }
//                                                 },
//                                                 0
//                                             ]
//                                         }
//                                     },
//                                     in: {
//                                         _id: "$$matchedUser._id",
//                                         name: "$$matchedUser.name",
//                                         profile: "$$matchedUser.profile",
//                                         email: "$$matchedUser.email"
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         { $project: { users: 0 } },
//         {
//             $addFields: {
//                 totalRating: { $sum: "$review.rating" }
//             }
//         },
//         {
//             $sort: { totalRating: -1 }
//         },
//         {
//             $project: { totalRating: 0 } 
//         }
//     ]);

//     return cities;
// };


import { City } from "../models/city";

export const getCitiesSortedByRating = async () => {
    const cities = await City.aggregate([
        // Lookup reviews
        {
            $lookup: {
                from: "cityreviews",
                localField: "review",
                foreignField: "_id",
                as: "review"
            }
        },
        // Lookup users for reviews
        {
            $lookup: {
                from: "users",
                localField: "review.user",
                foreignField: "_id",
                as: "users"
            }
        },
        // Lookup tourist spots
        {
            $lookup: {
                from: "touristspots",
                localField: "touristSpot",
                foreignField: "_id",
                as: "touristSpot"
            }
        },
        // Map review with populated user
        {
            $addFields: {
                review: {
                    $map: {
                        input: "$review",
                        as: "r",
                        in: {
                            _id: "$$r._id",
                            rating: "$$r.rating",
                            comment: "$$r.comment",
                            createdAt: "$$r.createdAt",
                            updatedAt: "$$r.updatedAt",
                            user: {
                                $let: {
                                    vars: {
                                        matchedUser: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$users",
                                                        as: "u",
                                                        cond: { $eq: ["$$u._id", "$$r.user"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    },
                                    in: {
                                        _id: "$$matchedUser._id",
                                        name: "$$matchedUser.name",
                                        profile: "$$matchedUser.profile",
                                        email: "$$matchedUser.email"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        { $project: { users: 0 } },
        // Compute totalRating
        {
            $addFields: {
                totalRating: { $sum: "$review.rating" }
            }
        },
        // Sort by totalRating descending
        {
            $sort: { totalRating: -1 }
        },
        // Remove totalRating field
        {
            $project: { totalRating: 0 }
        },
        // Remove `city` field from touristSpot
        {
            $addFields: {
                touristSpot: {
                    $map: {
                        input: "$touristSpot",
                        as: "t",
                        in: {
                            _id: "$$t._id",
                            name: "$$t.name",
                            description: "$$t.description",
                            history: "$$t.history",
                            latitude: "$$t.latitude",
                            longitude: "$$t.longitude",
                            gallery: "$$t.gallery",
                            createdAt: "$$t.createdAt",
                            updatedAt: "$$t.updatedAt"
                        }
                    }
                }
            }
        }
    ]);

    return cities;
};
