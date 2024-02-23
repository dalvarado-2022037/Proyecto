'use strict'

import jwt from 'jsonwebtoken'

const secretKey = '@LlaveProyectoSuperSecreto2024@'

export const generateJwt = async(payload)=>{
    try {
        return jwt.sign(payload,secretKey,{
            expiresIn: '3H',
            algorithm: 'HS256'//Opcional
        })
    }catch(err){
        console.error(err)
        return err   
    }
}