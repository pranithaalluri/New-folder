const BASE_URL = "https://localhost:65037/api";

export const USE_DUMMY_DATA = true;

// ─────────────────────────────────────────────
// AUTH HEADERS
// ─────────────────────────────────────────────

const getAuthHeaders = () => {
    const token = localStorage.getItem("gardener_token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

// ─────────────────────────────────────────────
// GET ALL FLOWERS
// GET /api/flowers
// ─────────────────────────────────────────────

export async function getFlowerThoughts(page = 1, limit = 20) {

    if (USE_DUMMY_DATA) {
        return [
            {
                id: "1",
                flowerType: "LilyOfTheValleyOUTLINED",
                thought: "Hello from mock garden!",
                isAnonymous: false,
                authorName: "MockUser",
                createdAt: new Date().toISOString(),
                worldX:200,
                worldY:200
            },
            {
                id: "2",
                flowerType: "LavenderOUTLINED",
                thought: "Silly wanderer path.",
                isAnonymous: true,
                authorName: null,
                createdAt: new Date().toISOString()
            }
        ];
    }

    const response = await fetch(
        `${BASE_URL}/flowers?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch flowers");
    }

    return response.json();
}

// ─────────────────────────────────────────────
// CREATE / PLANT FLOWER
// POST /api/flowers
// ─────────────────────────────────────────────

export async function createFlowerThought(data) {

    if (USE_DUMMY_DATA) {
        return {
            id: crypto.randomUUID(),
            flowerType: data.flowerType,
            thought: data.thought,
            isAnonymous: data.isAnonymous,
            authorName: "MockUser",
            moderationStatus: "Approved",
            createdAt: new Date().toISOString()
        };
    }

    const response = await fetch(`${BASE_URL}/flowers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || "Failed to plant flower");
    }

    return responseData;
}

// ─────────────────────────────────────────────
// LOGIN / REGISTER
// POST /api/auth/login
// POST /api/auth/register
// ─────────────────────────────────────────────

export async function authAccount(endpoint, bodyData) {

    if (USE_DUMMY_DATA) {
        return {
            token: "mock-valid-jwt-string",
            user: {
                id: crypto.randomUUID(),
                username: bodyData.username || "Wanderer",
                email: bodyData.email
            }
        };
    }

    const response = await fetch(`${BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
    }

    // SAVE TOKEN
    localStorage.setItem("gardener_token", data.token);

    // SAVE USER
    localStorage.setItem(
        "gardener_user",
        JSON.stringify(data.user)
    );

    return data;
}

// ─────────────────────────────────────────────
// GET MY FLOWERS
// GET /api/flowers/mine
// ─────────────────────────────────────────────

export async function getMyFlowers() {

    const response = await fetch(`${BASE_URL}/flowers/mine`, {
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch your flowers");
    }

    return response.json();
}

// ─────────────────────────────────────────────
// DELETE FLOWER
// DELETE /api/flowers/:id
// ─────────────────────────────────────────────

export async function deleteFlower(id) {

    const response = await fetch(`${BASE_URL}/flowers/${id}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete flower");
    }

    return true;
}