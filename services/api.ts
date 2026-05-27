import axios from "axios";

const BASE_URL = "https://eazy-ticket-backend.infra.bytework.app.br";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000
});

export { api };