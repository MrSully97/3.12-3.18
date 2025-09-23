const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('please provide all arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://csully710_db_user:${password}@cluster0.84xqehp.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', phonebookSchema)

if(process.argv.length === 5) {
  const name = process.argv[3]
  const phone = process.argv[4]

  const person = new Person({
    name: name,
    number: phone
  })

  person.save().then(() => {
    console.log(`added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
  })
}
else if(process.argv.length === 3) {
  Person.find({}).then(person => {
    console.log(person)
    mongoose.connection.close()
  })
}