import { Router } from 'express';
import { 
    addProduct, 
    bestSellingProduct, 
    bestSellingProducts, 
    categoryProduct, 
    deleteProdu, 
    lookForAllProducts,
    productsNotExists, 
    testProducts, 
    updateProdu, 
    viewProduct 
} from './productos.controller.js'
import { validateJwt, isAdmin } from '../middleware/validate-jwt.js'

const api = Router()

//Cualquiera
api.get('/testProduct', testProducts)

//Cualqueira logeado
api.get('/lookForAllProducts', [validateJwt], lookForAllProducts)
api.post('/viewProduct', [validateJwt], viewProduct)
api.get('/productsNotExists', [validateJwt], productsNotExists)
api.get('/categoryProduct/:id', [validateJwt], categoryProduct)
api.get('/bestSellingProduct', [validateJwt], bestSellingProduct)
api.get('/bestSellingProducts', [validateJwt], bestSellingProducts)

//Solo admin
api.post('/addProduct', [validateJwt, isAdmin], addProduct)
api.put('/updateProdu/:id', [validateJwt, isAdmin], updateProdu)
api.delete('/deleteProdu/:id', [validateJwt, isAdmin], deleteProdu)


export default api