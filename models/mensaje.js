import mongoose from 'mongoose';

const mensajeSchema = new mongoose.Schema({
  autor: {
    type: String,
    enum: ['religioso', 'filosofa'],
    required: true
  },
  contenido: {
    type: String,
    required: true
  },

});

export default mongoose.model('Mensaje', mensajeSchema);

