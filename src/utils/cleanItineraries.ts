export const cleanItinerariesPlaces = (
    itineraries: any[],
    fieldsToRemove: string[]
): any[] => {
    return itineraries.map((itinerary) => {
        if (!itinerary.places) return itinerary;

        itinerary.places = itinerary.places
            .map((p: any) => {
                if (!p.placeId) return null;

                const place = { ...p.placeId };
                fieldsToRemove.forEach((field) => delete place[field]);

                return place;
            })
            .filter(Boolean);

        return itinerary;
    });
};
