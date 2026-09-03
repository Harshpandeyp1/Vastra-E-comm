
import axios from "axios";

const API = "http://localhost:8081/chat";

export const sendMessage = async (message) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        API,
        {
            message: message
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
};

