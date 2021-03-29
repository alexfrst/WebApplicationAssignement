const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const fs = require('fs')
const  MongoClient = require("mongodb").MongoClient;


app.use(bodyParser.json())

app.use("/whiteboard",express.static('1/whiteboard'))
app.use("/movies",express.static('3/movies'))
app.use("/media",express.static('media'))
app.use("/gallery",express.static('2/gallery'))

io.on('connection', (socket) => {
    console.log("connected")
    socket.on('drawing', msg => {
        console.log(msg)
        socket.broadcast.emit('drawing', msg);

    });
    socket.on('connectionmsg', msg =>{
        console.log(msg)
        io.emit('connectionmsg', msg)
    })
});

let db = null;
let collection = null;

const client = new MongoClient(process.env.mongouri);

async function GetCollection() {
    await client.connect();
    db = client.db('finalProject')
    collection = db.collection('images')
};
GetCollection()

const saveImagesInfos = async (filename, user) => {
    const doc = {path:filename,user:user,date:new Date().toLocaleString("fr-FR")};
    collection.insertOne(doc);
}

const getImagesInfos = async() => {
    const result = []
    const cursor = await collection.find({}).toArray()

    for(const line of cursor){
        result.push(line)
    }
    return result
}

app.post('/data', async(req, res) => {
    console.log("receiving file")
    try{
        const file = req.body.file.replace(/^data:image\/\w+;base64,/, "")
        const buf = Buffer.from(file,"base64")
        const filename = (getDateTime()+req.body.user.replace("_",""))
        fs.writeFile(`./media/${filename}.png`,buf,(err => {if(err){
            console.log(err)
            res.status(500).send(err)
        }else{
            console.log("successfull upload")
            res.status(200).send("success")
        }
        saveImagesInfos(`../media/${filename}.png`,req.body.user)
        }))
    }catch (e){
        console.log(e)
        res.status(500).send(e)
    }
})

app.get('/data',async (req, res) => {
    const obj = await getImagesInfos()
    console.log(obj)
    res.send(obj)
})

app.get('/',((req, res) => {
    res.send(`
You can browse the projects here
<ul>
<li><a href="/whiteboard">Assignement 1 and 2</a></li>
<li><a href="/gallery">For the galery necessary for assignement 2 (also available vie the browse button)</a></li>
<li><a href="/movies">For assignement 3</a></li>
</ul>`)
}))

const getDateTime = () => {
     return new Date().toISOString().replace('-',"")
         .replace("T","")
         .replace(":","")
         .replace("-","")
         .replace(".","")
         .replace(":","").substring(0,16)
}


http.listen(port, () => {
    console.log(`server running at http://localhost:${port}/`);
});