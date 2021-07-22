const mongoose = require('mongoose')



const password = process.argv[2]



const url =
  `mongodb+srv://sammakko:${password}@cluster0.z4ovw.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})



if(process.argv[3] == undefined){

  console.log('phonebook:')

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
      })
    mongoose.connection.close()
  })
}
else {
  person.save().then(response => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}



