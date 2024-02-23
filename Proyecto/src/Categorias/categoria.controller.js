import Categoria from './categoria.model.js'

export const testCategoria = (req, res)=>{
    return res.send('Conectado a Categoria')
}

export const addCategoria = async(req,res)=>{
    try{
        let data = req.body
        let categoria = new Categoria(data)
        await categoria.save()
        return res.send({message: 'Added invoice'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error category could not be added',err})
    }
}

export const viewCategoria = async(req, res)=>{
    try{
        let { name } = req.body
        let categoria = await Categoria.findOne({name})
        if (categoria){
            let loggedCategoria = {
                name: categoria.name,
                description: categoria.description
            }
            return res.send({message: `The ${categoria.name} found`, loggedCategoria})
        }
        return res.status(404).send({message: 'Invalid Name'})
    }catch(error){
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
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

export const daleteCategoria = async(req, res)=>{
    try{
        let { id } = req.params
        let deleteCatego = await Categoria.findOneAndDelete({_id:id})
        if(!deleteCatego) return res.status(404).send({message: 'The category could not be deleted'})
        return res.send({message: `The category: ${deleteCatego.name} has been successfully removed`})
    }catch(error){
        
    }
}