export default function addBusinessDays(date, days) {
    let result = new Date(date);
    let added = 0;

    while (added < days) {
        result.setDate(result.getDate() + 1);
        const day = result.getDay();
        if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
            added++;
        }
    }

    return result.toISOString(); // format for Supabase timestamp
}