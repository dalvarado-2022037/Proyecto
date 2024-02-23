import { Router } from 'express';
import { addCategoria, daleteCategoria, lookForAllCategoria, testCategoria, updateCategoria, viewCategoria } from './categoria.controller.js'

const api = Router()

api.get('/testCategoria',testCategoria)
api.post('/addCategoria',addCategoria)
api.post('/viewCategoria',viewCategoria)
api.get('/lookForAllCategoria',lookForAllCategoria)
api.put('/updateCategoria/:id',updateCategoria)
api.delete('/daleteCategoria/:id',daleteCategoria)


export default api