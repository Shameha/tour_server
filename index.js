const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t86vw4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   
  //  await client.connect();
  
   const volCollection = client.db('volDB').collection('volunteer');
  
   app.get('/volunteer',async(req,res)=>{
    const cursor = volCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })
  
   app.post('/volunteer',async(req,res)=>{
    const newVol = req.body;
    console.log(newVol);
    const result = await volCollection.insertOne(newVol);
    res.send(result);
  })


   
  // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('volenteear is running')
})


app.listen(port,()=>{
    console.log(`volenteear ${port}`);
})
