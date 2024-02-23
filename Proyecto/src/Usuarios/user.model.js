import {
    Schema,
    model
} from 'mongoose'

const userSchema = Schema({
    name:{
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    gmail:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        uppercase: true,
        enum: ['ADMIN','CLIENT'],
        required: true
    }
})

export default model('user',userSchema)


