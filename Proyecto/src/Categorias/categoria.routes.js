import { Router } from 'express';
import { 
    addCategoria, 
    deleteCategoria, 
    lookForAllCategoria, 
    testCategoria, 
    updateCategoria 
} from './categoria.controller.js'
import { validateJwt, isAdmin } from '../middleware/validate-jwt.js'

const api = Router()

//Cualquiera
api.get('/testCategoria', testCategoria)

//Cualqueira logeado
api.get('/lookForAllCategoria', [validateJwt], lookForAllCategoria)

//Solo Admin
api.post('/addCategoria', [validateJwt, isAdmin], addCategoria)
api.put('/updateCategoria/:id', [validateJwt, isAdmin], updateCategoria)
api.delete('/daleteCategoria/:id', [validateJwt, isAdmin], deleteCategoria)


export default api