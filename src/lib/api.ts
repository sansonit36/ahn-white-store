const API_URL = '/api';

export const api = {
    // Products
    getProducts: async () => {
        const res = await fetch(`${API_URL}/products`);
        return res.json();
    },
    createProduct: async (data: any) => {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    updateProduct: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteProduct: async (id: string) => {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    },

    // Orders
    getOrders: async () => {
        const res = await fetch(`${API_URL}/orders`);
        return res.json();
    },
    createOrder: async (data: any) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    updateOrder: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteOrder: async (id: string) => {
        await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
    },

    // Settings
    getSettings: async () => {
        const res = await fetch(`${API_URL}/settings`);
        return res.json();
    },
    updateSettings: async (data: any) => {
        const res = await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    // Media
    getMedia: async () => {
        const res = await fetch(`${API_URL}/media`);
        return res.json();
    },
    addMedia: async (data: any) => {
        const res = await fetch(`${API_URL}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteMedia: async (id: string) => {
        await fetch(`${API_URL}/media/${id}`, { method: 'DELETE' });
    },

    // Upload
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        return res.json();
    }
};
