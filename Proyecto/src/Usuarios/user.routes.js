import { Router } from 'express'
import { deleteUser, login, register, testUser, updateUser } from './user.controller.js'
import { validateJwt } from '../middleware/validate-jwt.js'

const api = Router()

api.get('/testUser', testUser)
api.post('/register', register)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt], updateUser)
api.delete('/deleteUser/:id', [validateJwt], deleteUser)

export default api
