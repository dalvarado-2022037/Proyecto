import { Router } from 'express'
import { 
    changeRol,
    deleteUser, 
    login, 
    register, 
    testUser, 
    updateUser 
} from './user.controller.js'
import { validateJwt, isAdmin } from '../middleware/validate-jwt.js'

const api = Router()

//Cualquiera
api.get('/testUser', testUser)
api.post('/register', register)
api.post('/login', login)

//Cualquiera logeado
api.put('/updateUser/:id', [validateJwt], updateUser)
api.delete('/deleteUser/:id', [validateJwt], deleteUser)

//Solo Admin
api.put('/changeRol/:id', [validateJwt, isAdmin], changeRol)

export default api
