require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.static('dist'));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//  MongoDB Connection
const url = process.env.mongodb_Url;

mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error.message));

mongoose.set('strictQuery', false);

//  Define Schema & Model
const peopleSchema = new mongoose.Schema({

    name: String,
    number: String,
}, { collection: 'people' });

const People = mongoose.model('People', peopleSchema);

//  Logger Middleware
morgan.token('body', (req, res) => (req.method === 'POST' ? JSON.stringify(req.body) : ' '));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//  Get All Persons (From MongoDB)
app.get('/api/persons', (req, res) => {
    People.find({}).then(people => {
        res.json(people);
    }).catch(error => {
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

//  Get a Single Person by ID (From MongoDB)
app.get('/api/persons/:id', (req, res) => {
    People.findById(req.params.id)
        .then(person => {
            if (person) res.json(person);
            else res.status(404).json({ error: "Person not found" });
        })
        .catch(error => {
            console.error('Error fetching person:', error);
            res.status(400).json({ error: "Invalid ID" });
        });
});

// Info Route
app.get('/info', (req, res) => {
    People.countDocuments()
        .then(count => {
            const currentDate = new Date();
            res.send(`<p>Phonebook has info for ${count} people</p><p>${currentDate}</p>`);
        })
        .catch(error => {
            console.error('Error counting people:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Delete a Person by ID
app.delete('/api/persons/:id', async (req, res) => {
    console.log("Deleting person with id:", req.params.id);
    try {
        const deletedPerson = await People.findByIdAndDelete(req.params.id);
        if (!deletedPerson) {
            return res.status(404).json({ error: "Person not found" });
        }
        res.status(204).end(); // No content to send back
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({ error: "Server error" });
    }
});
//  Add a New Person (Saving to MongoDB)
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    People.findOne({ name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({ error: "Name must be unique" });
        }

        const newPerson = new People({ name, number });

        newPerson.save()
            .then(savedPerson => res.status(201).json(savedPerson))
            .catch(error => {
                console.error('Error saving person:', error);
                res.status(500).json({ error: "Internal Server Error" });
            });
    });
});

// Serve Frontend for All Other Routes
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

//  Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

