const express = require('express')
const app = express();


app.get('/', (req, res) => {
    res.send("page here");
});


app.listen(3000, () => {
    console.log("connected");
});

