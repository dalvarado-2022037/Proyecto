import Factura from './factura.model.js'
import Carrito from '../CarritoCompras/carrito.model.js'
import Productos from '../Productos/productos.model.js'
import User from '../Usuarios/user.model.js'
import PDFKitDocument from 'pdfkit'
import fs from 'fs'

export const testFactura = (req, res)=>{
    return res.send('Conectado a Factura')
}

export const buyOnlyProduct = async(req, res)=>{
    try{
        //Parametros que luego usaremos
        let { uid, name } = req.user
        let cart = await Carrito.findOne({cliente:uid})
        if(!cart) 
            return res.status(404).send({message: 'Nor foud in cartShoping'})
        let infoProducts = cart.data
        let subtotal = 0
        let total = 0
        let now = Date.now()

        //Creamos un documento PDF para realizar la fatura
        let pdfDoc = new PDFKitDocument()

        //Para tener una factura por cliente le asignamos el nombre del cliente
        pdfDoc.pipe(fs.createWriteStream(`${name}.pdf`))
        pdfDoc.fontSize(30).moveDown().text('Factura', {width: 410, align: 'center'})
        pdfDoc.fontSize(16).moveDown()
        pdfDoc.text(`The user: ${name}`)
        pdfDoc.text('\n')
        pdfDoc.text('Date: ' + now)

        //Realizamos un map con los datos para obtener el precio y la cantida
        //Como realizaremos una busqueda designamos que va a ser una promesa
        //Y decimos que es asincrona
        let info = await Promise.all(infoProducts.map(async(infoProducts) =>{

            //Buscamos el producto para usar su precio y modificar su stock
            let product = await Productos.findOne({_id:infoProducts.products})
            //Ingresamos los datos
            pdfDoc.text('The product ' + product.name + ` (cant: ${infoProducts.cantida}) `, {width: 410, align: 'left'}, )
            .text('Q.'+(product.price*infoProducts.cantida), {width: 410, align: 'right'})
            subtotal += parseFloat(product.price) * parseFloat(infoProducts.cantida)

            await Productos.findOneAndUpdate({_id: infoProducts.products}, {
                stock: (product.stock - infoProducts.cantida),
                venta: (product.venta + infoProducts.cantida)})

            return {
                product: product.id,
                cantidad: infoProducts.cantida
            } 
        }))
        pdfDoc.text('\n')
        pdfDoc.text('\n')
        pdfDoc.fillColor('red').text('-----------------------------------------------------------------------------')
        pdfDoc.fillColor('black')
        pdfDoc.text('SubTotal ', {width: 410, align: 'left'}, ).text(subtotal, {width: 410, align: 'right'})
        total = subtotal + (subtotal * 0.13)
        pdfDoc.text('Total ', {width: 410, align: 'left'}, ).text(total, {width: 410, align: 'right'})
        pdfDoc.text('\n')
        pdfDoc.text('\n')
        
        let data = {
            cliente: uid,
            data: info,
            subTotal: subtotal,
            total: total
        }
        
        let factura = new Factura(data)
        await factura.save()
        await Carrito.findOneAndDelete({cliente: uid})
        
        pdfDoc.text(`invoice code: ${factura._id}`)

        pdfDoc.end()
        return res.send({message: 'Proceso todo'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to the connected to buyOnlyProduct'}) 
    }
}

export const viewFactura = async(req, res)=>{
    try{
        let { id } = req.params
        let { uid } = req.user
        let factura = await Factura.findOne({_id:id})
        let loggedFactura = null
        
        if(!factura) 
            return res.status(404).send({message: 'Nor foud in factura'})
        let infoProducts = factura.products
        let info = await Promise.all(infoProducts.map(async(infoProducts) =>{
            let product = await Productos.findOne({_id:infoProducts._id})
            return {
                products: product
            }
        }))
        if(factura.cliente != uid) 
            return res.status(404).send({message: 'it`s not your bill'})

        if(factura){
            loggedFactura = {
                cliente: factura.cliente,
                productos: info,
                subtotal: factura.subTotal,
                total: factura.total
            }
        }
        return res.send({message: `The facture found`, loggedFactura})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
    }
}

export const viewAllMyFactura = async(req, res)=>{
    try{
        let { uid } = req.user
        let factura = await Factura.find({cliente: uid})
        let loggedFactura = []

        if(!factura) 
            return res.status(404).send({message: 'Nor foud in factura'})

        for (let i = 0; i < factura.length; i++) {            
            let infoProducts = factura[i].products
            let info = await Promise.all(infoProducts.map(async(infoProducts) =>{
                let product = await Productos.findOne({_id:infoProducts._id})
                if(factura[i].cliente != uid) 
                    return res.status(404).send({message: 'it`s not your bill'})
                console.log(loggedFactura);
                if(factura[i]){
                    loggedFactura += [{
                        cliente: factura.cliente,
                        productos: product,
                        subtotal: factura.subTotal,
                        total: factura.total
                }]}
            }))
        }
        return res.send({message: `The facture found`, loggedFactura})
    }catch(err){
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
    }
}

export const lookForAllFactura = async(req,res)=>{
    try{
        let all = await Factura.find({})
        return res.send({message: all})
    }catch(error){        
        console.error(err)
        return res.status(404).send({message: 'Error when searching'})
    }
}

export const updateFacture = async(req, res)=>{
    try{
        let { pid } = req.params
        let { producto, cantida } = req.body
        let continuar = true
        let subtotal = 0
        let total = 0
        
        let factura = await Factura.findOne({_id: pid})
        if(!factura)
            return res.status().send({message: 'Not found Bill'})
        let infoProducts = factura.data

        let { name, id } = await User.findOne({_id:factura.cliente})

        let product = await Productos.findOne({_id: producto})
        if(!product)
            return res.status().send({message: 'Not found Product'})

        let pdfDoc = new PDFKitDocument()
    
        pdfDoc.pipe(fs.createWriteStream(`${name}.pdf`))
        pdfDoc.fontSize(30).moveDown().text('Factura', {width: 410, align: 'center'})
        pdfDoc.fontSize(16).moveDown()
        pdfDoc.text(`The user ${name}`)
        pdfDoc.text('\n')
    
        let info = await Promise.all(infoProducts.map(async(infoProducts) =>{
            let product = await Productos.findOne({_id:infoProducts.product})
            pdfDoc.text('The product ' + product.name + ` (${cantida}) `, {width: 410, align: 'left'}, )
            .text(product.price, {width: 410, align: 'right'})

            if(product.id == producto){
                if(cantida>infoProducts.cantidad)
                    continuar = false
                subtotal += parseFloat(product.price) * (parseFloat(infoProducts.cantidad) - parseInt(cantida))
                await Productos.findOneAndUpdate({_id: infoProducts.products}, {
                    stock: (product.stock - (infoProducts.cantidad+cantida)),
                    venta: (product.venta + (infoProducts.cantidad-cantida))})
            }
            else{
                subtotal += parseFloat(product.price) * (parseFloat(infoProducts.cantida))
                await Productos.findOneAndUpdate({_id: infoProducts.products}, {
                    stock: (product.stock - infoProducts.cantida),
                    venta: (product.venta + infoProducts.cantida)})
            }
            return {
                product: product,
                cantidad: (parseInt(infoProducts.cantidad) - parseInt(cantida))
            }
        }))
        if(continuar){
            pdfDoc.text('\n')
            pdfDoc.text('\n')
            pdfDoc.fillColor('red').text('-----------------------------------------------------------------------------')
            pdfDoc.fillColor('black')
            pdfDoc.text('SubTotal ', {width: 410, align: 'left'}, ).text(subtotal, {width: 410, align: 'right'})
            total = subtotal + (subtotal * 0.13)
            pdfDoc.text('Total ', {width: 410, align: 'left'}, ).text(total, {width: 410, align: 'right'})
            pdfDoc.text('\n')
            pdfDoc.text('\n')
            
            let data = {
                cliente: id,
                data: info,
                subTotal: subtotal,
                total: total
            }
            
            let newFactura = await Factura.findOneAndUpdate({_id:pid},data, {new: true})        
            pdfDoc.text(`invoice code: ${newFactura._id}`)
    
            pdfDoc.end()
        }else
            return res.status(403).send({message: 'You cannot return more products than those purchased.'})
        return res.send({message: 'Proceso todo'})
    }catch(err){        
        console.error(err)
        return res.status(404).send({message: 'Error when updateFacture'})
    }
}
