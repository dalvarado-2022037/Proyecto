import { Schema, model} from "mongoose";
  
const facturaSchema = Schema({
    name: {

    },
    cliente: {

    },
    products: [{

    }],
    subTotal: {

    },
    total: {

    }
})

export default model('factura', facturaSchema)