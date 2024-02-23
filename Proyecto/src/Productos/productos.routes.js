import { Router } from 'express';
import { 
    addProduct, 
    categoryProduct, 
    deleteProdu, 
    lookForAllProducts,
    productsNotExists, 
    testProducts, 
    updateProdu, 
    viewProduct 
} from './productos.controller.js'

const api = Router()

api.get('/testProduct', testProducts)
api.post('/addProduct', addProduct)
api.get('/lookForAllProducts', lookForAllProducts)
api.post('/viewProduct', viewProduct)
api.get('/productsNotExists', productsNotExists)
api.get('/categoryProduct/:id', categoryProduct)
api.put('/updateProdu/:id', updateProdu)
api.delete('/deleteProdu/:id', deleteProdu)


export default api