import Carrito from './carrito.model.js'
import Products from '../Productos/productos.model.js'

export const test = (req, res)=>{
    return res.send({message: 'Connected to Cart'})
}

export const shoppingCart = async(req, res)=>{
    try{
        let { id } = req.params
        let { cantidad } = req.body
        let { uid } = req.user
        let regex = /^\d+$/
        
        let productEsxit = await Products.findOne({_id: id})
        if(!productEsxit) 
            return res.status(404).send({message: 'The product does not exist'})
        
        if(!regex.test(cantidad))
            return res.status(400).send({message: 'Only numerical data in Cantidad'})
        
        if(parseInt(cantidad)>productEsxit.stock) 
            return res.status(400).send({message: 'There are not enough products'})
        
        let exist = await Carrito.findOne({cliente: uid}).populate('cliente', ['name'])
        if(!exist){
            let dataCart = {
                cliente: uid,
                data: {
                    products: productEsxit,
                    cantida: parseInt(cantidad)
                }
            }
            let newCart = new Carrito(dataCart)
            await newCart.save()
            return res.send({message: 'Producto add, current products:  ', newCart})
        }else{
            let cantidadExistente = 0
            let { data } = await Carrito.findOne({_id: exist.id}).populate('cliente', ['name'])
            for (let i = 0; i < data.length; i++) 
                if(data[i].products == id)
                    cantidadExistente = data[i].cantida
            if(parseInt(cantidad)+cantidadExistente>productEsxit.stock)
                return res.status(400).send({message: 'You cannot buy more than what exists'})
            let inc = await Carrito.findOneAndUpdate({_id: exist.id, "data.products": id}, {$inc: {"data.$.cantida": parseInt(cantidad)}}).populate('cliente', ['name'])
            if(!inc){
                exist.data.push({products:productEsxit, cantida: cantidad})
                await exist.save()
                return res.send({message: 'Producto add, current products: ', exist})
            }
            return res.send({message: 'Producto add, current products: ', inc})
        }
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to the connected to shoppingCart'}) 
    }
}

export const deletedProduct = async(req, res)=>{
    try{
        let { producto, cantidad } = req.body
        let { uid } = req.user
        let regex = /^\d+$/

        let productEsxit = await Products.findOne({_id: producto})
        if(!productEsxit) 
            return res.status(404).send({message: 'The product does not exist'})
        
        if(!regex.test(cantidad)) //Only-solo
            return res.status(400).send({message: 'Only numerical data in Cantidad'})
        
        if(parseInt(cantidad)<0) 
            return res.status(400).send({message: 'Cannot be a negative number'})
        
        let exist = await Carrito.findOne({cliente: uid}).populate('cliente', ['name'])
        if(exist){
            let cantidadExistente = 0
            let { data } = await Carrito.findOne({_id: exist.id}).populate('cliente', ['name'])
            for (let i = 0; i < data.length; i++) 
                if(data[i].products == producto)
                    cantidadExistente = data[i].cantida
            if(parseInt(cantidad)-cantidadExistente<0)
                return res.status(400).send({message: 'You cannot remove more products'})
            let inc = await Carrito.findOneAndUpdate({_id: exist.id, "data.products": producto}, 
            {$inc: {"data.$.cantida": -parseInt(cantidad)}}).populate('cliente', ['name'])

            if(!inc){
                exist.data.push({products:productEsxit, cantida: cantidad})
                await exist.save()
                return res.send({message: 'Producto add, current products: ', exist})
            }
            return res.send({message: 'Producto add, current products: ', inc})
        }else
            return res.status(404).send({message: 'The shopping cart does not exist'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to the connected to shoppingCart'}) 
    }
}