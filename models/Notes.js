const mongoose = require('mongoose')

const { Schema } = mongoose;

  const notesSchema = new Schema({
      title: {
          type: String,
          required: true
      },
      description: {
        type: String,
        required: true,
        default: 'General'
    },
      tag: {
        type: String,
        default: 'general'
    },
    date: {
        type: String,
        default: Date.now
    },
  });

  module.exports = mongoose.model('user', notesSchema)