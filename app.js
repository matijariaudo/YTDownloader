const axios = require('axios');
const express = require('express');
require('dotenv').config()
const path=require('path');
const { trial, sendVideo, eliminarCarpeta, extractVideoId } = require('./videoyt');
const { send, sendMedia } = require('./sendFunction');

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, './public')));

app.post('/api', async(req, res)=>{
    const {remoteJid,conversation}=req.body;
    if(remoteJid=='5493406460886@s.whatsapp.net'){
        if(conversation.indexOf('youtube')){
            const code=extractVideoId(conversation)
            console.log(code)
            if(!code){send("5493406460886@s.whatsapp.net",`I can't send you de audio :(`);return;}
            const url=await sendVideo(code)
            console.log(url)
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            await sendMedia("5493406460886@s.whatsapp.net",`I send to you the audio`,baseUrl+url.urlFile,url.name)
            eliminarCarpeta(url.auxName);
        }
    }
})
app.get('/api',async(req,res)=>{
    const url=await sendVideo("lGNwnstqAO4")
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    sendMedia("5493406460886@s.whatsapp.net",`I send to you the audio`,baseUrl+url.urlFile,url.name)
    return res.json({url: baseUrl+url.urlFile})

})

app.get('/test',async(req,res)=>{
    //const url=await sendVideo("lGNwnstqAO4")
    //const baseUrl = `${req.protocol}://${req.get('host')}`;
    send("5493406460886@s.whatsapp.net",`I send to you the audio`)
    return res.json({a:"a"})

})

const port=process.env.PORT|| 8000;
app.listen(port)
console.log("Listen ",port)






function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}