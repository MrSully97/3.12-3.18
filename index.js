require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/Person");
const app = express();

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [];

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>
        </div>`);
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person);
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if(person) {
            response.json(person);
        }
        else {
            response.statusMessage = `No person at id: ${id}`;
            response.status(404).end();
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body;

    console.log('check this body: ', body);

    if(!body.name) {
        return response.status(400).json({
            error: "no name found"
        })
    }
    else if(!body.number) {
        return response.status(400).json({
            error: "no number found"
        })
    }
    // else if(persons.find(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}) 