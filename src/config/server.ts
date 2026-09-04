import express from 'express'
import router from '../Router/router'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './db'
import { corsConfig } from './cors'

connectDB()


const app = express()

require('dotenv').config(); // Carga variables desde .env


// Validación básica de variables requeridas
const requiredVars = ['CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'FRONTEND_URL'];
const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
    console.error('Error: Faltan variables de entorno:', missing);
    process.exit(1);
}


//cors
app.use(cors(corsConfig))

//formulario habilitamos para ver el objeto en JSON
app.use(express.json())

//Routing
app.use('/', router)

export default app