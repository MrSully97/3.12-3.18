const mongoose = require('mongoose')

const url = process.env.MONGOURI;

mongoose.set('strictQuery', false);

mongoose.connect(url)
    .then(result => {
        console.log('Connected to mongoDB');
    })
    .catch(error => {
        console.log(`Connection to mongoDB failed: ${error.message}`);
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)