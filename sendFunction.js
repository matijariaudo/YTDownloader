const axios = require('axios');
require('dotenv').config();

function send(remoteJid,message) {
    const token = process.env.TOKEN;
    const data1 = {
      instanceId:process.env.INSTANCEID,
      remoteJid:remoteJid,
      message,
    }
    const headers = {
        Authorization: `Bearer ${token}`,
        Connection: 'keep-alive',
        'Content-Type': 'application/json'
    };
    console.log(headers, data1);
    axios.post(process.env.APIURL+'/api/instance/send', data1, { headers })
        .then(response => {
            console.log(response.data, response.data.data);
        })
        .catch(error => {
            console.error('Error al hacer la solicitud:', error);
        });
}

async function sendMedia(remoteJid,message,fileUrl,fileName) {
    const token = process.env.TOKEN;
    const data1 = {
      instanceId:process.env.INSTANCEID,
      remoteJid:remoteJid,
      caption:message,
      fileUrl,
      type:"audio",
      mimetype:"audio/mpeg",
      fileName,
      document:true
    }
    const headers = {
        Authorization: `Bearer ${token}`,
        Connection: 'keep-alive',
        'Content-Type': 'application/json'
    };
    console.log(headers, data1);
    try {
        const response=await axios.post(process.env.APIURL+'/api/instance/sendmedia', data1, { headers })
        console.log(response.data, response.data.data)
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }
}

module.exports={send,sendMedia}