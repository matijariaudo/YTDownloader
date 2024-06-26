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
    try {
        const {remoteJid,conversation}=req.body;
        if(remoteJid=='5493406460886@s.whatsapp.net'){
            if(conversation.indexOf('youtube')){
                const code=extractVideoId(conversation)
                console.log("codigo:",code)
                if(!code){send("5493406460886@s.whatsapp.net",`I can't send you de audio :(`);return false;}
                console.log("Seguimos")
                const url=await sendVideo(code)
                console.log(url)
                const baseUrl = `${req.protocol}://${req.get('host')}`;
                await sendMedia("5493406460886@s.whatsapp.net",`I send to you the audio`,baseUrl+url.urlFile,url.name)
                eliminarCarpeta(url.auxName);
            }
        }    
    } catch (error) {
        
    }
    return res.json({msg: "Muchas gracias"})
})
app.get('/api',async(req,res)=>{
    const url=await sendVideo("lGNwnstqAO4")
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    sendMedia("5493406460886@s.whatsapp.net",`I send to you the audio`,baseUrl+url.urlFile,url.name)
    return res.json({url: baseUrl+url.urlFile})

})

app.get('/test',async(req,res)=>{
    send("5493406460886@s.whatsapp.net",`⚠️ New supplier has arrived.`)
    return res.redirect(`mensaje.html`);
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