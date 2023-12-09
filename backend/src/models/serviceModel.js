const mongoose = require("mongoose");

const {Schema} = mongoose;

const serviceSchema = new Schema({
    name : {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },

    categories: { type: String, enum: ['Desayuno', 'Almuerzo', 'Cena', 'Vegetariana', 'Postres'], required: true },
    ingredients: {
        type: [String], 
        required: true 
        },
    steps: { 
            type: [String], 
            required: true 
        },
    image: {
        type: String,
        require: true
    },
    publicationDate: {
        type: Date,
        required: true,
        default: Date.now // Establecer la fecha actual por defecto al crear la receta
    },

    likes: { 
        type: Number, 
        default: 0 
    },

    comments: [{
        user: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: false // Hacer la fecha de comentario opcional
        }
    }]
    
},

{
    timeseries: true
});

const Service = mongoose.model("Service", serviceSchema);

module.exports= {
    Service,
    serviceSchema
}
