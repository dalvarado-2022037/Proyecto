import { Router } from 'express';
import { addFactura, lookForAllFactura, testFactura, viewFactura } from './factura.controller.js'

const api = Router()

api.get('/testFactura', testFactura)
api.post('/addFactura', addFactura)
api.post('/viewFactura', viewFactura)
api.get('/lookForAllFactura', lookForAllFactura)


export default api