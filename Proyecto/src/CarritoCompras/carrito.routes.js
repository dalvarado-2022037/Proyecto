import { Router } from 'express'
import { 
    deletedProduct,
    shoppingCart, test 
} from './carrito.controller.js'
import { validateJwt } from '../middleware/validate-jwt.js'

let api = Router()

api.get('/test', test)
api.post('/shoppingCart/:id', [validateJwt], shoppingCart)
api.put('/deletedProduct', [validateJwt], deletedProduct)

export default api