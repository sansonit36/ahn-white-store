const API_URL = '/api';

export const api = {
    // Products
    getProducts: async () => {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        return products.map((p: any) => ({
            ...p,
            images: p.images ? JSON.parse(p.images) : []
        }));
    },
    createProduct: async (data: any) => {
        const payload = { ...data };
        if (Array.isArray(payload.images)) {
            payload.images = JSON.stringify(payload.images);
        }

        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const product = await res.json();
        return {
            ...product,
            images: product.images ? JSON.parse(product.images) : []
        };
    },
    updateProduct: async (id: string, data: any) => {
        const payload = { ...data };
        if (Array.isArray(payload.images)) {
            payload.images = JSON.stringify(payload.images);
        }

        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const product = await res.json();
        return {
            ...product,
            images: product.images ? JSON.parse(product.images) : []
        };
    },
    deleteProduct: async (id: string) => {
        await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    },

    // Orders
    getOrders: async (params?: any) => {
        // Filter out undefined/null values
        const validParams = params
            ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== '')) as Record<string, string>
            : {};

        const qs = Object.keys(validParams).length > 0 ? '?' + new URLSearchParams(validParams).toString() : '';
        const res = await fetch(`${API_URL}/orders${qs}`);
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
        const settings = await res.json();
        return {
            ...settings,
            realGlowImages: settings.realGlowImages ? JSON.parse(settings.realGlowImages) : []
        };
    },
    updateSettings: async (data: any) => {
        const payload = { ...data };
        if (Array.isArray(payload.realGlowImages)) {
            payload.realGlowImages = JSON.stringify(payload.realGlowImages);
        }
        const res = await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const settings = await res.json();
        return {
            ...settings,
            realGlowImages: settings.realGlowImages ? JSON.parse(settings.realGlowImages) : []
        };
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

    // Upload with Progress
    uploadFile: (file: File, onProgress?: (percent: number) => void): Promise<{ url: string }> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API_URL}/upload`);

            if (xhr.upload && onProgress) {
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        onProgress(percent);
                    }
                };
            }

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(new Error('Invalid JSON response'));
                    }
                } else {
                    reject(new Error(xhr.statusText || 'Upload failed'));
                }
            };

            xhr.onerror = () => reject(new Error('Network Error'));

            xhr.send(formData);
        });
    },

    // Analytics
    heartbeat: async (data: { id: string; hasCart: boolean; isCheckout: boolean }) => {
        await fetch(`${API_URL}/analytics/heartbeat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },
    getLiveStats: async () => {
        const res = await fetch(`${API_URL}/analytics/live`);
        return res.json();
    },
    getReport: async (range: string) => {
        const res = await fetch(`${API_URL}/analytics/stats?range=${range}`);
        return res.json();
    },

    // Reviews
    getReviews: async () => {
        const res = await fetch(`${API_URL}/reviews`);
        return res.json();
    },
    createReview: async (data: any) => {
        const res = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    deleteReview: async (id: number) => {
        await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
    }
};
