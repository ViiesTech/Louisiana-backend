import moment from "moment";

export const calculateDuration = (startDate: string, endDate: string): string => {
    const start = moment(startDate, "DD-MM-YYYY");
    const end = moment(endDate, "DD-MM-YYYY");

    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
        return "0 Days"; 
    }

    const months = end.diff(start, "months");
    const remainingStart = start.clone().add(months, "months");

    const days = end.diff(remainingStart, "days") + 1;

    let result = "";

    if (months > 0) {
        result += months === 1 ? "1 Month" : `${months} Months`;
    }

    if (days > 0) {
        result += result ? ` ${days} Days` : `${days} Days`;
    }

    return result || "0 Days";
};
