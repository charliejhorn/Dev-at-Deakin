export async function getSubscription(email) {
    try {
        if (!email) return null;
        const params = new URLSearchParams({ email });
        const res = await fetch(`/api/subscriptions?${params.toString()}`);
        if (!res.ok) {
            console.log("getSubscription error:", res.statusText);
            return null;
        }
        const data = await res.json();
        return data?.items?.[0] ?? null;
    } catch (e) {
        console.log("getSubscription error:", e);
        return null;
    }
}
