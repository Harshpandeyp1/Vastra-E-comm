

import axios from 'axios'

const API ='http://localhost:8081/order'

export const placeOrder=async(orderData)=>{
  try{
    console.log('sending order to',API,orderData);

    const resp=await axios.post(`${API}/place`,orderData,{
      headers:{'Content-Type':'application/json'},
    });
    return resp.data;
  }catch(err){
    if(err?.response){
    console.error('order API error',err.response.status,err.response.data);
  }else{
     console.error('order api request failed',err.message||err);
  }
  throw err;
}
}
export const getUserOrders=async(userId)=>{
  const res=await axios.get(`http://localhost:8081/order/user/${userId}`);
  return res.data;
}
