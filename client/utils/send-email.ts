export async function sendEmail(data) {
    const apiEndpoint = '/api/email';

    try {
        const res = await fetch(apiEndpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (res.ok) {
            return await res.json();
        } else {
            throw new Error((await res.json()).message);
        }
    } catch(err) {
        throw err;
    }
}
