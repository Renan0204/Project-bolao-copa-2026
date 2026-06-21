import axios from "axios";

const BASE_URL = "http://10.0.2.2:8080";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

export { api };
