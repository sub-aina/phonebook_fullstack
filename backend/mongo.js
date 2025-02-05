const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://subaina12345:${password}@subaina.dgtzy.mongodb.net/phonebook?retryWrites=true&w=majority&appName=subaina`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const peopleSchema = new mongoose.Schema({
    name: String,
    number: String,
}, { collection: 'people' });

const People = mongoose.model('People', peopleSchema);

People.find({}).then(result => {
    console.log("Existing people in database:");
    result.forEach(person => console.log(person));

    return People.insertMany([
        { name: "Abdul Wahab", number: "39-44-5323523" },
        { name: "Ayesha Khan", number: "92-55-8123456" },
        { name: "Ali Raza", number: "21-99-3344556" }
    ]);
}).then(() => {
    console.log('Person saved successfully!');
}).catch(err => {
    console.error("Error:", err);
}).finally(() => {
    mongoose.connection.close();
});
