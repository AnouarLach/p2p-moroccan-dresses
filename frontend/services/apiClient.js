const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchJurken() {
    const response = await fetch(`${BASE_URL}/jurken`);
    if (!response.ok) {
        throw new Error('Failed to fetch jurken');
    }
    return response.json();
}
