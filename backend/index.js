const express = require('express')
const morgan = require('morgan')
const app = express();
app.use(express.static('dist'))

// app.get('/', (request, response) => {
//     response.send('<h1>Hello World!</h1>')
// })


app.use(express.json());
const cors = require('cors')

app.use(cors())

// const mongoose = require('mongoose');


// const password = process.argv[2];

// const url = `mongodb+srv://subaina12345:${password}@subaina.dgtzy.mongodb.net/phonebook?retryWrites=true&w=majority&appName=subaina`;

// mongoose.set('strictQuery', false);
// mongoose.connect(url);

// const peopleSchema = new mongoose.Schema({
//     name: String,
//     number: String,
// }, { collection: 'people' });

// const People = mongoose.model('People', peopleSchema);
// morgan.token('body', (req, res) => {
//     return req.method === 'POST' ? JSON.stringify(req.body) : ' ';
// })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
let persons = [
    {
        "id": "1",
        "name": "Subaina Munib",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Abdul Wahab",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Zainab Khalil",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Shareen",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id)

    if (person)
        res.json(person)
    else
        res.status(404).json({ error: "not found" })
})

app.get('/info', (req, res) => {
    const currentdate = new Date();
    const dateTime = currentdate.toString();
    const num = persons.length;

    res.send(
        `<p>Phonebook info for ${num} people</p>
        <p>${dateTime}</p>`
    )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const initiallen = persons.length;
    persons = persons.filter(person => person.id !== id)

    if (persons.length < initiallen)
        res.status(204).end();
    else
        res.status(404).json({ error: "not found" });
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    const n = persons.find(person => person.name === name);
    if (n) {
        return res.status(400).json({ error: "name must be unique" });
    }
    if (!name) {
        return res.status(400).json({ error: "name required" });
    }

    if (!number) {
        return res.status(400).json({ error: "number required" });
    }

    const newId = String(Math.max(...persons.map(p => parseInt(p.id))) + 1);

    const newperson = {
        id: newId,
        name,
        number
    };

    persons.push(newperson);
    res.status(201).json(newperson);
})
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

require('dotenv').config();
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
