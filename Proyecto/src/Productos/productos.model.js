import mongoose, { Schema, model} from 'mongoose'
import { categoriDefault } from './productos.controller.js'

const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    venta: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'categoria',
        required: true
    }
})

export default model('products', productSchema)