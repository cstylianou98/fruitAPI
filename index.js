// const http = require("http") //http built into node

// const server = http.createServer((req, res) => {
//     // res.statusCode = 404; // browser will display this error now
//     console.log(req.url)
//     console.log(req.method)
//     res.setHeader("Content-Type", "text/html") // now telling that we have the following content being html
//     res.end("<img src='https://pbs.twimg.com/media/Dj8XlmjV4AEzsvr.jpg'>") // Creates server but wont show if we don't tell server its HTML
// }) //req = request obj, res = response obj

// server.listen(3000, ()=> {
//     console.log("Server Ready")
// })

//libraries such as express js exist to help. Most widely used htp server for node etc.. This is to give some idea for a server.



// NOW WE WILL USE EXPRESS PACKAGE in an easy example

// const express = require("express")
// const app = express()
// const port = 3000

// app.get("/", (req,res)=>{
//     res.send("Hello World!")
// }) // "/" represents home page

// app.get("/chicken", (req,res) => {
//     res.send("Hello Chicken")
// })

// app.get("/chicken/:name", (req,res) => {
//     res.send(req.params) // params will give you the parameter. So in website u go /chicken/bob for example
//     // res.send(req.query) //will be empty because we dont have a query in /chicken/bob -> would have to be /chicken/bob?apikey=1234. Particularly when you are checking APIs.
// })

// app.get("/example", (req,res) => {
//     res.sendStatus (418) //sends status directly to browser. Good practice to do so.
//     // res.statusCode = 404
//     res.send()
// })


// FRUIT API

require('dotenv').config()
const cors = require('cors')
const fruits = require("./fruits.json")
const express = require("express")
const app = express()
const port = process.env.PORT

// app.use((req,res,next) =>{
//     console.log("I am a piece of Middleware")
//     next() //without this, webpage runs forever.
// })

app.use(cors) //to avoid cors error
app.use(express.json())

app.get("/", (req,res)=> {
    res.send("Hello Fruit API")
})

app.get("/fruits", (req,res)=> {
    res.send(fruits)
})

//Check if the fruit exists
const getFruitIndex = name => {
    // Take in a lowercase fruit name and return the index of the fruit or -1 (if it cant find anything)
    return fruits.findIndex((fruit) => fruit.name.toLowerCase == name)
}

app.post("/fruits", (req, res)=>{
    const fi = getFruitIndex(req.body.name.toLowerCase())
    if(fi > -1){
        res.status(409).send("The fruit already exists")
    } else {
        //Create an array of all ids
        const ids = fruits.map((fruit) => fruit.id)
        //Get the maximum ID
        let maxId = Math.max(...ids)
        //Increment that by one
        maxId++
        //Adjust ID to new maxID
        req.body.id = maxId

        fruits.push(req.body)
        res.status(201).send(req.body)
    }
    res.send("New Fruit Created")
})

app.delete("/fruits/:name", (req, res) => {
    const fi = getFruitIndex(req.params.name.toLowerCase())
    if( fi ==-1){
        //Fruit cannot be found
        res.status(404).send("Fruit can not be found")
    }else{

        fruits.splice(fi, 1)
        res.sendStatus(200) //just the status code thats why its like this
    }
})

app.get("/fruits/:name", (req,res)=> {
    const name = req.params.name.toLowerCase() //get name of what we are searching for
    const fruit = fruits.find(fruit => fruit.name.toLowerCase() == name) //Search fruits.json (fruits) to return fruit if the names match
    if(fruit == undefined){
        ///There is no fruit
        res.status(404).send("The fruit doesn't exist")
    } else{
        //If there is a fruit
        res.send(fruit)
    }
 //THIS IS BACKEND AND USES EXPRESS AS ITS RUNNING ON THE SERVER.
})

app.listen(port, ()=>{
    console.log(`Server is now listening on port ${port}`)
})