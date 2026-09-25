import axios from "axios";

const BackApi = axios.create({
  baseURL: "/backend-api/squad",
});

export default BackApi;