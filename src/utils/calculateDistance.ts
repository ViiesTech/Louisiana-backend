import axios from "axios";
import { googleMapsApiKey } from "../config/env";

/**
 * Calculates driving distances using Google Maps Distance Matrix API.
 * Returns null for destinations where distance calculation fails or if API key is missing.
 */
export const getDrivingDistances = async (
    origin: { lat: number; lng: number },
    destinations: { lat: number; lng: number }[]
): Promise<(number | null)[]> => {
    if (!googleMapsApiKey || destinations.length === 0) {
        return destinations.map(() => null);
    }

    try {
        const chunkDestinations = (arr: any[], size: number) =>
            Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                arr.slice(i * size, i * size + size)
            );

        // Google Matrix API allows up to 25 destinations per request
        const chunks = chunkDestinations(destinations, 25);
        const allDistances: (number | null)[] = [];

        for (const chunk of chunks) {
            const destString = chunk.map(d => `${d.lat},${d.lng}`).join("|");
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destString}&key=${googleMapsApiKey}`;

            const response = await axios.get(url);

            if (response.data.status === "OK") {
                const elements = response.data.rows[0].elements;
                elements.forEach((el: any) => {
                    if (el.status === "OK") {
                        // distance.value is in meters
                        allDistances.push(el.distance.value / 1000);
                    } else {
                        allDistances.push(null);
                    }
                });
            } else {
                throw new Error(response.data.error_message || `Distance Matrix API error: ${response.data.status}`);
            }
        }

        return allDistances;
    } catch (error) {
        console.error("Driving distance calculation failed:", error);
        // Return null for all on catch to ensure the controller knows it failed
        return destinations.map(() => null);
    }
};
