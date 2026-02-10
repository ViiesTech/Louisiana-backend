"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanItinerariesPlaces = void 0;
const cleanItinerariesPlaces = (itineraries, fieldsToRemove) => {
    return itineraries.map((itinerary) => {
        if (!itinerary.places)
            return itinerary;
        itinerary.places = itinerary.places
            .map((p) => {
            if (!p.placeId)
                return null;
            const place = { ...p.placeId };
            fieldsToRemove.forEach((field) => delete place[field]);
            return place;
        })
            .filter(Boolean);
        return itinerary;
    });
};
exports.cleanItinerariesPlaces = cleanItinerariesPlaces;
