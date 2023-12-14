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

    categories: {
        type: String,
        enum: ['Desayuno', 'Almuerzo', 'Cena', 'Vegetariana', 'Postres'],
        required: true
    },
    
    ingredients: {
        type: [String], 
        required: true 
    },
    
    steps: { 
        type: [], 
        required: true 
    },
    
    image: {
        type: String,
        require: true
    },
    origin: {
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
        default: 0,
    },

    likesBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    // comments: [{
    //     user: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'User',
    //         required: true
    //     },
    //     text: {
    //         type: String,
    //         required: true
    //     },
    //     date: {
    //         type: Date,
    //         default: Date.now,
    //         required: false // Hacer la fecha de comentario opcional
    //     }
    // }],

    comments: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          text: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
            required: false,
          },
        },
      ],
  
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    
},

{
    timeseries: true
});

const Service = mongoose.model("Service", serviceSchema);

module.exports= {
    Service,
    serviceSchema
}
