const express = require('express');

const app = express();

app.get('/', (req, res)=>{
    res.send('Got a get request!');
});

app.post('/', (req, res)=>{
    res.send('Got a post request!');
});

app.put('/', (req, res)=>{
    res.send('Got a put request!');  
});

app.delete('/', (req, res)=>{
    res.send('Got a delete request!');
});

app.listen(3000, () => {
    console.log('Server ready!')
});