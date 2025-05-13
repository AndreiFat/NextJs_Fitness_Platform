export default function formatDate(dateString) {
    return new Date(dateString).toLocaleString('ro-RO', {
        timeZone: 'Europe/Bucharest',
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}