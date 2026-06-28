import axios from "axios";
const API = "http://localhost:8081/chat"
export const sendMessage=async(message)=>{
    const response=await axios.post(API,{
        message:message
    });
    return response.data;
}