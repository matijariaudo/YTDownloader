const express = require('express');
const yt = require("yt-converter");
const fs=require('fs');
const path=require('path')
const fse = require('fs-extra');

const app = express()
require('dotenv').config()

function buscar_video(url)
{
    return new Promise((resolve, reject) => {
        yt.getInfo(url).then(info => {
        resolve(info)
        }).catch(e=>{
        resolve()
        });    
    })
    
}

function descargar_video(url,name,carpeta)
{
    return new Promise((resolve, reject) => {
        yt.convertAudio({
            url: url,
            itag: 140,
            directoryDownload: __dirname+"/public/files/"+carpeta,
            title:name
            }, (a)=>{
            console.log("Bajando: %",a)
            }, (path)=>{
            console.log("Se ha bajado")
            resolve( __dirname+"/public/files/"+carpeta)
        })       
    })
    
}
function limpiarTexto(texto) {

}

function crearCarpeta(name){
    // Ruta de la carpeta que deseas crear
    const nombreCarpeta = './public/files/'+name;
    // Verificar si la carpeta ya existe
    if (!fs.existsSync(nombreCarpeta)) {
    // Crear la carpeta
    fs.mkdir(nombreCarpeta, (err) => {
        if (err) {
        console.error('Error al crear la carpeta:', err);
        } else {
        console.log('Carpeta creada exitosamente:', nombreCarpeta);
        }
    });
    } else {
    console.log('La carpeta ya existe:', nombreCarpeta);
    }
}
function eliminarCarpeta(name) {
    const nombreCarpeta = './public/files/'+name; // Ruta de la carpeta que deseas eliminar
    // Elimina la carpeta y su contenido de forma recursiva
    fse.remove(nombreCarpeta)
      .then(() => {
        console.log('Carpeta y su contenido eliminados:', nombreCarpeta);
      })
      .catch((err) => {
        console.error('Error al eliminar la carpeta:', err);
      });
}
function generarCodigoAleatorio(nro=4) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codigo = '';
  
    for (let i = 0; i < nro; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(randomIndex);
    }
    return codigo;
}
  
function verArchivos(name){
    return new Promise((resolve, reject) => {
        const directorio='./public/files/'+name;
        let archivoEncontrado=false;
        console.log("directorio",directorio)
        fs.readdir(directorio, (err, archivos) => {
            if (err) {
                console.error('Error al leer el directorio:', err);
                return;
            }
            archivos.forEach((archivo) => {
                console.log("Arch",archivo)
                if(!archivoEncontrado){resolve(archivo);}
            });
        });
    })
}

const sendVideo=async(cod)=>{
    data=await buscar_video("https://www.youtube.com/watch?v="+cod)
    if(!data){
        return null
    }else{
        const provisorioName=generarCodigoAleatorio();
        console.log()
        crearCarpeta(provisorioName);
        console.log(1)
        const nuevoAudio=await descargar_video("https://www.youtube.com/watch?v="+cod,data.title,provisorioName)
        console.log(2,nuevoAudio,provisorioName)
        const nameArchivo=await verArchivos(provisorioName);
        return {urlFile:'/files/'+provisorioName+'/'+nameArchivo,name:nameArchivo,auxName:provisorioName};
    }
}


function extractVideoId(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const videoId = pathname.split('/')[1]; // El ID del video es la segunda parte del pathname
    return videoId;
}

const trial=(t)=>{
    return (req,res)=>{
        res.json({[t]:t})
    }
}

module.exports={trial,sendVideo,eliminarCarpeta,extractVideoId}