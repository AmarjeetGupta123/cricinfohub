import axios from "axios";

const BackApi = axios.create({
  baseURL: "https://cricinfohub-api.onrender.com/api/squad",
});

export default BackApi;