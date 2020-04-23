const mongoose = require('mongoose');

mongoose
    .connect(
        process.env.MONGODB_URI.replace("<password>", process.env.MONGODB_PASSWORD),
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("database connected successfully");
    })
    .catch((err) => {
        console.log(err.message);
    });

/*
mongoose
    .connect('mongodb://localhost/carmarket',
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("database connected successfully");
    })
    .catch((err) => {
        console.log(err.message);
    });
*/