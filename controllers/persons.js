
const personsRoputer = require('express').Router()
const Person = require('../models/person')

personsRoputer.get('/info', (req, res) => {

  const date = new Date()
  Person.find({}).countDocuments().then(c => {
    res.send(
      `<p>Phonebook has info for ${c} people</p>
      <p>${date}</p>`
    )
  })

})

personsRoputer.get('/', (request, response) => {

  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRoputer.get('/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

personsRoputer.delete('/:id', (request, response, next) => {

  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/*
const generateID = (max) => {
  return Math.floor(Math.random() * max);
}
*/

personsRoputer.post('/', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const person =  new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})


personsRoputer.put('/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

module.exports = personsRoputer