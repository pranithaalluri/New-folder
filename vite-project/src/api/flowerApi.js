const BASE_URL = "https://localhost:65037/api";

export const USE_DUMMY_DATA = true;

// Helper to grab token safely from browser storage
const getAuthHeaders = () => {
    const token = localStorage.getItem('gardener_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// 1. GET ALL FLOWERS
export async function getFlowerThoughts() {
    if (USE_DUMMY_DATA) {
        return [
            { id: '1', thought: 'Hello from mock garden!', flowerType: 'DaffodilOUTLINED', worldX: 200, worldY: 150, waterCount: 2, createdAt: new Date() },
            { id: '2', thought: 'Silly wanderer path.', flowerType: 'LavenderOUTLINED', worldX: 450, worldY: 300, waterCount: 0, createdAt: new Date() }
        ];
    }

    const response = await fetch(`${BASE_URL}/FlowerThoughts`);
    if (!response.ok) {
        throw new Error("Failed to fetch thoughts");
    }
    return response.json();
}

// 2. CREATE / PLANT A FLOWER
export async function createFlowerThought(data) {
    if (USE_DUMMY_DATA) {
        return {
            id: crypto.randomUUID(),
            thought: data.thought,
            flowerType: data.flowerType,
            worldX: data.worldX,
            worldY: data.worldY,
            waterCount: 0,
            createdAt: new Date().toISOString()
        };
    }

    const response = await fetch(`${BASE_URL}/FlowerThoughts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders() // Attaches your JWT Bearer token here
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to create thought");
    }

    return response.json();
} 

// 3. NEW AUTHENTICATION CALLS (Maps directly to your C# AuthController)
export async function authAccount(endpoint, bodyData) {
    if (USE_DUMMY_DATA) {
        return { token: 'mock-valid-jwt-string', user: { username: bodyData.username || 'Wanderer' } };
    }

    // endpoint will be either "login" or "register"
    const response = await fetch(`${BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        // Throws the exact conflict/unauthorized message from your backend
        throw new Error(errorData.message || 'Authentication error.');
    }

    const data = await response.json();
    
    // Save the returned token to localStorage upon successful login/registration
    localStorage.setItem('gardener_token', data.token);
    
    return data;
}