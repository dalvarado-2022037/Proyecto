import { Router } from 'express';
import { 
    buyOnlyProduct, 
    lookForAllFactura,
    testFactura, 
    updateFacture, 
    viewAllMyFactura, 
    viewFactura 
} from '../Facturas/factura.controller.js'
import { validateJwt, isAdmin } from '../middleware/validate-jwt.js'

const api = Router()

//Cualquiera
api.get('/testFactura', testFactura)

//Cualquiera logeado
api.get('/viewFactura/:id', [validateJwt], viewFactura)
api.get('/viewAllMyFactura', [validateJwt], viewAllMyFactura)
api.get('/buyOnlyProduct', [validateJwt], buyOnlyProduct)

//Solo admin
api.get('/lookForAllFactura', [validateJwt, isAdmin], lookForAllFactura)
api.put('/updateFacture/:pid', [validateJwt, isAdmin], updateFacture)


export default api