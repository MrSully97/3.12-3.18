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

// Get info on how many people are in the phonebook
app.get('/info', (request, response) => {
    Person.find({})
        .then(result => {
            response.send(`
            <div>
                <p>Phonebook has info for ${result.length} people</p>
                <p>${Date()}</p>
            </div>`);
        });
})

// Get entire phonebook
app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person);
    })
})

// Get specific person from phonebook by ID
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
    .catch(error => next(error))
})

// Delete person from phonebook
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Add person to phonebook
app.post('/api/persons', (request, response, next) => {
    const body = request.body;
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => next(error))
})

// Update a person in the phonebook
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body;

    Person.findById(request.params.id)
        .then(person => {
            if(!person) {
                return response.status(404).end()
            }
            
            person.name = name;
            person.number = number;

            return person.save()
                .then(updatedPerson => {
                    response.json(updatedPerson)
                })  
        })
        .catch(error => next(error))
})

// returns error for unkown url
const unknownEndPoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'});
    }
    else if(error.name === 'ValidationError') {
        return response.status(400).send({error: error.message});
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}) 