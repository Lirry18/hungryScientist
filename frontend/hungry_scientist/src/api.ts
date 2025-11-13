export const API_URL = "http://localhost:4000";

export async function fetchEateries() {
    return fetch(`${API_URL}/eateries`).then(r => r.json());
}

export async function addEatery(name: string) {
    return fetch(`${API_URL}/eateries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include",
    }).then(r => r.json());
}

export async function vote(id: number, type: "up" | "down") {
    return fetch(`${API_URL}/eateries/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
        credentials: "include",
    }).then(r => r.json());
}
