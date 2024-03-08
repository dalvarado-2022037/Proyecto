'use strict'

import Product from '../Productos/productos.model.js'
import Categori from '../Categorias/categoria.model.js'

export const testProducts = (req, res)=>{
    return res.send('Conectado a productos')
}
export const addProduct = async(req, res)=>{
    try{
        let data = req.body
        let regex = /^\d+(\.\d+)?$/
        let category = await Categori.findOne({_id:data.category})

        if(!category) 
            return res.status(404).send({message: 'Not exist category'})
        if(!regex.test(data.price) || !regex.test(data.stock)) 
            return res.status(402).send({message: 'Price or Stock only numerical data'})

        console.log(typeof data.category);
        if(!data.category || data.category == null) 
            data.category = req.categoriDefault.id
        
        let product = new Product(data)
        await product.save()
        return res.send({message: 'Product successfully added'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error product could not be added | Respect all params'})
    }
}

export const viewProduct = async(req, res)=>{
    try{
        let { name } = req.body
        let product = await Product.findOne({name: new RegExp(name, 'i')}).populate('category')
        if (product){
            let loggedProduct = {
                id: product._id,
                name: product.name,
                category: product.category,
                date: product.dueDate,
                description:  product.description,
                price: product.price
            }
            return res.send({message: `The ${product.name} found`, loggedProduct})
        }
        return res.status(404).send({message: 'Invalid Name'})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
    }
}

export const lookForAllProducts = async(req, res)=>{
    try{
        let all = await Product.find({}).populate('category')
        return res.send({message: all})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error when searching'})
    }
}

export const productsNotExists = async(req, res)=>{
    try{
        let all = await Product.find({stock: '0'}).populate('category')
        return res.send({message: 'The products Non-stock: ', all})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error when searching'}) 
    }
}

export const categoryProduct = async(req, res)=>{
    try{
        let { id } = req.params
        let categoria = await Categori.findOne({_id: id})
        if(!categoria) return res.status(404).send({message: 'Not existent category'})
        let all = await Product.find({category: id}).populate('category')
        if(all.length == '0') return res.status(404).send({message: `There are no products with this category: ${categoria.name}`})
        return res.send({message: `The products in this ${categoria.name} are:`, all})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error when searching'})
    }
}

export const bestSellingProduct = async(req, res)=>{
    try{
        let date = new Product()
        let all = await Product.find({}).populate('category')
        for (let i = 0; i < all.length; i++) {
            if(date.venta <= all[i].venta)
                date = all[i]
        }
        return res.send({message: 'The product best selling: ', date})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error when searching'}) 
    }
}

export const bestSellingProducts = async(req, res)=>{
    try{
        let all = await Product.find({}).sort({venta: -1}).limit(5).populate('category')
        return res.send({message: 'The product best selling: ', all})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error when searching'}) 
    }
}

export const updateProdu = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedProduct) return res.status(401).send({message: 'The product could not be updated'})
        return res.send({message: 'Updated product', updateProdu})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Unexpected error while updating'})
    }
}

export const deleteProdu = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedProduct = await Product.findOneAndDelete({_id: id})
        if(!deletedProduct) return res.status(404).send({message: 'The product could not be deleted'})
        return res.send({message: `The product: ${deletedProduct.name} has been successfully removed`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Unexpected error while deleting'})
    }
}