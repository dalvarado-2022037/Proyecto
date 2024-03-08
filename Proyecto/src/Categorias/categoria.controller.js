import Categoria from './categoria.model.js'
import Product from '../Productos/productos.model.js'

export const testCategoria = (req, res)=>{
    return res.send('Conectado a Categoria')
}

export const categoriaDefault = async(req, res)=>{
    try{
        let exist = await Categoria.findOne({name:'DEFAULT'})
        if(!exist){
            let data = {
                name: 'DEFAULT',
                description: 'Product without category without register'
            }
            let categoria = new Categoria(data)
            await categoria.save()
            console.log('Category default created')
        }
        console.log('Category default exist');
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error category could not be added',err})
    }
}

export const addCategoria = async(req,res)=>{
    try{
        let data = req.body
        let categoria = new Categoria(data)
        await categoria.save()
        return res.send({message: 'Added category'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error category could not be added',err})
    }
}

export const lookForAllCategoria = async(req,res)=>{
    try{
        let all = await Categoria.find({})
        return res.send({message: all})
    }catch(error){        
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
    }
}

export const updateCategoria = async(req,res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let updatedCatego = await Categoria.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCatego) return res.status(401).send({message: 'The category could not be updated'})
        return res.send({message: 'Updated category', updatedCatego})
    }catch(error){
        console.error(err)
        return res.status(404).send({message: 'Unexpected error while updating'})
    }
}

export const deleteCategoria = async(req, res)=>{
    try{
        let { id } = req.params

        let idDefault = await Categoria.findOne({name:'DEFAULT'})
        await Product.updateMany({category: id}, {category: idDefault._id})

        let deleteCatego = await Categoria.deleteOne({_id:id})
        if(!deleteCatego)
            return res.status(404).send({message: 'The category could not be deleted'})

        return res.send({message: `The category: ${deleteCatego.name} has been successfully removed`})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Unexpected error while daleteCategoria'})
    }
}
