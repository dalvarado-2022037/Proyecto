import { compare, hash } from 'bcrypt';

export const encrypt = async(password)=>{
    try{
        return await hash(password, 10)//El valor y cuantas capas
    }catch(err){
        console.error(err)
        return err
    }
}

export const checkPassword = async(password, has)=>{
    try{
        return await compare(password, has)
    }catch(err){
        console.error(err)
        return err
    }
}

export const checkUpdate = (data, userId)=>{
    if(userId){
        if(
            Object.entries(data).length == 0 || 
            data.password ||
            data.password == '' ||
            data.role ||
            data.role == ''
        )return false
        return true
    }else{
        return false
    }
}

export const isAdmin = async(req, res, next)=>{
    try{
        let { role, username } = req.user
        if(!role || role != 'ADMIN') return res.status(403).send({message: `You dont have acces | username ${username}`})
        next()
    }catch(err){
        return false
    }
}

/**
    try{
        
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to the connected to "name"'}) 
    }
 */