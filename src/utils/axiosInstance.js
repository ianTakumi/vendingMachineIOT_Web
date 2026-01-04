import axios from "axios";

const baseURL = import.meta.env.PROD
  ? "https://vendingmachineiot-server.onrender.com/api"
  : "http://localhost:5000/api";

const client = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
