const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(bodyParser.json())

const students = [];

app.post('/students', (req, res)=>{
    students.push(req.body)
    res.json(students);
});

app.get('/students',(req,res)=>{
    res.json(students);
});

app.get('/students/:id',(req,res)=>{
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);
    res.json(student)
});

app.put('/students/:id', (req,res) =>{
    const id = Number(req.params.id);
    const student = req.body;
    const index = students.findIndex(s => s.id === id);
    students[index] = student;
    res.json(student);
});

app.delete('/students/:id', (req,res) =>{
    const id = Number(req.params.id);
    const index = students.findIndex(s => s.id === id);
    students.splice(index, 1);
    res.json(students);
});

app.listen(port, () => {
    console.log(`listening on port ${port}!`)
})
