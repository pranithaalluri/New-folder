const BASE_URL = "https://localhost:65037/api";

export async function getFlowerThoughts() {
    const response = await fetch(`${BASE_URL}/FlowerThoughts`);

    if (!response.ok) {
        throw new Error("Failed to fetch thoughts");
    }

    return response.json();
}

export async function createFlowerThought(data) {
    const response = await fetch(`${BASE_URL}/FlowerThoughts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to create thought");
    }

    return response.json();
} 