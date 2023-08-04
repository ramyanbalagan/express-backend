const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');

const authRoute = require('./routes/AuthRoute')
const taskRoute = require('./routes/TasksRoute')

require('dotenv').config();


app.use(cors())
app.use(express.json())

const mongoDB = process.env.MONGO_DB

const mongooseConnect = async () => {
    try {
        await mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connected to database');
    } catch (error) {
        console.log(error);
    }
}

mongooseConnect();

app.listen(8080, (req, res) => {
    console.log('backend server connected');
})

app.use('/api', authRoute);
app.use('/api', taskRoute)