require('dotenv').config()

const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan');
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))


const Person = require('../models/person')


let persons = [
    {
      "name": "Arto Hellas",
      "number": "050323666969",
      "id": 1
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Ada Lovelace",
      "number": "020202420",
      "id": 5
    }
  ]

app.get('/info', (req, res) => {
  const date = new Date()
  Person.find({}).countDocuments().then(c => {
    res.send(
      `<p>Phonebook has info for ${c} people</p>
      <p>${date}</p>`
    )
  })
  
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)  
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateID = (max) => {
  return Math.floor(Math.random() * max);
}


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  /*
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name is already in the phonebook' 
    })
  }*/

  const person =  new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

  //persons = persons.concat(person)
  //response.json(persons)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})