import axios from 'axios';

const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8002'}/`,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
    }
});

// Interceptor per le richieste
instance.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers["x-request-id"] = crypto.randomUUID();

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor per le risposte
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        console.log("API Error:", {
            url: error.config?.url,
            status,
            data: error.response?.data,
        });

        return Promise.reject(error);
    }
);

export default instance;