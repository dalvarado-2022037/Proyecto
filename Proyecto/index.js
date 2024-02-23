import { initServer } from './configs/app.js';
import { connect } from './configs/mongo.js';
import { adminDefault } from './src/Usuarios/user.controller.js'

initServer()
connect()
adminDefault()