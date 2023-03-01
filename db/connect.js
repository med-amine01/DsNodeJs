const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:user123@cluster0.ewwmf15.mongodb.net/ds-node-db?retryWrites=true&w=majority')
.then(()=> console.log("mongodb is connected"))
.catch(err=> console.log("mongodb not connected " + err));