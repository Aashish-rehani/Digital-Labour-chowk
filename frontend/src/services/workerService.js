import api from "./api";

export const fetchWorkers = () => api.get("/workers");
