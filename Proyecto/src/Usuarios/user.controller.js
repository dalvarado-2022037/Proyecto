'use strict'

import User from './user.model.js'
import { checkPassword, encrypt, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const testUser = (req, res)=>{
    return res.send('Connect User')
}

export const adminDefault = async(req, res)=>{
    try{
        let userExist = await User.findOne({username: 'dalvarado'})
        if(!userExist){
            let data = {
                name: 'Douglas',
                surname: 'Alvarado',
                username: 'dalvarado',
                gmail: 'dalvarado@kinal.edu.gt',
                password: await encrypt('12345678'),
                role: 'ADMIN'
            }
            let user = new User(data)
            await user.save()
            console.log('User created')
        }
        console.log('User default exist')
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error adding administrator'})
    }
}

export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({message: 'Registered successfully'})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message: 'Error registering user', err})
    }
}

export const login = async(req, res)=>{
    try{
        let { username, password, gmail } = req.body
        let user = await User.findOne({
            $or: [
                {
                    username: username
                },{
                    gmail: gmail
                }
            ]
        })
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send({message: `Welcome ${user.username}`, loggedUser, token})
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Failed to login'})
    }
}

export const updateUser = async(req, res)=>{
    try{
        let { id } = req.params
        let { uid, role } = req.user
        let data = req.body
        if(role == 'CLIENT')
            if(id != uid) 
                return res.status(403).send({message: 'You cannot alter this users information.'})
        
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have sumbmitted some data that cannot be updated or missing data'})
        let updateUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updateUser) return res.status(401).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updateUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message: 'Error updating account'}) 
    }
}

export const deleteUser = async(req, res)=>{
    try{
        let { id } = req.params
        let { uid, role, password } = req.user
        let data = req.body
        if (role == 'CLIENT') 
            if(id != uid)
                if(checkPassword(data.password, password))
                    return res.status(403).send({message: 'You cannot alter this users information'})
        let userDelete = await User.findOneAndDelete({_id: id})
        if(!userDelete) return res.status(404).send({message: 'Account not foud and not deleted'})
        return res.send({message: `Account with username ${userDelete.username} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

export const changeRol = async(req, res)=>{
    try{
        let { uid } = req.user
        let { id } = req.params
        let { role } = req.body
        let userAdmin = await User.findOne({_id:uid})
        let userChange = await User.findOne({_id:id})
        if(userAdmin.role == 'CLIENT')
            return res.status(403).send({message: 'You cannot alter this users information.'})

        if(!userChange) 
            return res.status(404).send({message: 'User not found'})

        let updateUser = await User.findOneAndUpdate(
            {_id: id},
            {role: role},
            {new: true}
        )
        if(!updateUser) 
            return res.status(401).send({message: 'User not found and not updated'})
        
        return res.send({message: 'Updated user rol', updateUser})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to the connected to "changeRol"'}) 
    }
}