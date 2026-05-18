import dotenv from "dotenv"
import axios from "axios"

export async function sendTheWhats(){
    const response = await axios({
        url: process.env.WHATSAPP_URL,
        method: 'post',
        headers:{
            'Authorization': `Bearer ${process.env.WHATSAPP_CLIENT}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to:'584264000136',
            type: 'template',
            template: {
                name: 'hello_world',
                language: {
                    code: 'en_US'
                }
            }
        })
    })
    return response.data;
}

console.log(sendTheWhats());