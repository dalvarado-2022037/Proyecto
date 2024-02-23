import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRoutes from '../src/Usuarios/user.routes.js'
import categoriaRoutes from '../src/Categorias/categoria.routes.js'
import productRoutes from '../src/productos/productos.routes.js'
import facturaRoutes from '../src/Facturas/factura.routes.js'

const app = express()//Creamos el servidor
config()
const port = process.env.PORT || 3200

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/user',userRoutes)
app.use('/categori',categoriaRoutes)
app.use('/products',productRoutes)
app.use('/factura',facturaRoutes)

export const initServer = ()=> {
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}

