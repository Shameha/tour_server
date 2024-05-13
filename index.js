const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors({
origin:[
'http://localhost:5173',

],
credentials:true

}));
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
   const beCollection =  client.db('volDB').collection('beVolunteer');
  
//auth related api
app.post('/jwt',async(req,res)=>{
const user = req.body;
console.log("user for token",user);
const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'2h'})
res.cookie('token',token,{
  httpOnly:true,
  secure:true,
  sameSite: 'none'
})
.send({success:true})

})

app.post('/logout',async(req,res)=>{
  const user = req.body;
  console.log('loging out',user);
  res.clearCookie('token',{maxAge: 0}).send({success:true})
})



   app.get('/volunteer',async(req,res)=>{
     const cursor = volCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })

   
  //  app.get('/volunteer',async(req,res)=>{
  //   const cursor = volCollection.find();
  //  const result = await cursor.toArray();
  //  res.send(result);
  // })
  
   app.get('/volunteer/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id) }
    const options = {
      
      sort: { "time": -1 },
      // Include only the `title` and `imdb` fields in the returned document
      projection: { title: 1, description: 1, location: 1 ,time: 1 ,category: 1 ,name: 1 ,email: 1 ,photo: 1,volunt:1 },
    };

    const result = await volCollection.findOne(query,options);
    res.send(result);
  })


   app.post('/volunteer',async(req,res)=>{
    const newVol = req.body;
    console.log(newVol);
    const result = await volCollection.insertOne(newVol);
    res.send(result);
  })

  //beVolenteer
app.get('/beVolunteer',async(req,res)=>{
  console.log(req.query.email);
  let query ={};
 if(req.query?.email){
  query = {email : req.query.email}
 }
  const result = await beCollection.find(query).toArray();
  res.send(result);
})

  app.post('/beVolunteer',async(req,res)=>{
    const beVolunteers = req.body;
  console.log(beVolunteers);
  const result = await beCollection.insertOne(beVolunteers);
  res.send(result)
  })

  app.get("/update/:id",async(req,res)=>{
    // console.log(req.params.id);
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await volCollection.findOne(query)
    console.log(result);
    res.send(result);
  })

  app.put("/updateTour/:id",async(req,res)=>{
    console.log(req.params.id);
    const query = {_id: new ObjectId(req.params.id)};
    const data ={
      $set:{
        title:req.body.title,
        description:req.body.description,
        volunt:req.body.volunt,
        location:req.body.location,
        time:req.body.time,
        category:req.body.category,
        photo:req.body.photo,
      }
    }
    const result =await volCollection.updateOne(query,data);
    console.log(result);
    res.send(result)
  })
     
   

  app.delete('/beVolunteer/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await beCollection.deleteOne(query);
    res.send(result);
  })


  app.get("/involunteer/:email",  async(req,res)=>{
    console.log(req.params.email);
    const result =await volCollection.find({ email: req.params.email }).toArray();
  console.log(result);
    res.send(result)
  })

  app.delete("/delete/:id",async(req,res)=>{
    const result = await volCollection.deleteOne({_id:new ObjectId(req.params.id)})
    console.log(result);
    res.send(result)
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
