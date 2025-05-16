const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3000
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Coffee Store server !')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yd2mcnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//! DB_USER="coffeeStore"
//! DB_PASS="JTsKpHRMsfxqrtpD"


// Create a database and a collection
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeesCollection = client.db('coffeeDB').collection('coffees')
    const usersCollection = client.db('coffeeDB').collection('users')
    app.get('/coffees',async (req, res)=>{
      // const cursor = coffeesCollection.find()
      // const result = await cursor.toArray()
      const result = await coffeesCollection.find().toArray()
      res.send(result)
    })
    app.get('/coffees/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeesCollection.findOne(query)
      res.send(result)

    })
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee);
     const result =await coffeesCollection.insertOne(newCoffee)
      res.send(result);
    })
    app.put('/coffees/:id',async (req,res)=>{
      const id =req.params.id;
      const query = {_id: new ObjectId(id)}
      const option = {upsert: true};
      const updatedCoffee = req.body;

      const updatedDoc = {
        $set: updatedCoffee 
      }
      const result= await coffeesCollection.updateOne(query,updatedDoc,option)
      res.send(result)
    })
    app.delete('/coffees/:id',async(req,res)=>{
       const id = req.params.id
       const query = {_id: new ObjectId(id)}
       const result = await coffeesCollection.deleteOne(query);
       res.send(result)
    })


    //! user releted apis
    app.get('/users',async(req,res)=>{
        const result = await usersCollection.find().toArray()
      res.send(result)
    })
    app.post('/users', async(req, res)=>{
      const data = req.body;
      console.log(data);
      const result = await usersCollection.insertOne(data);
      res.send(result)
    })
   app.patch('/users',async(req,res)=>{
    const {email,lastSignInTime}= req.body;
    const query = {email:email}
    const updatedDoc={
      $set:{
        lastSignInTime:lastSignInTime
      }
    }
    const result = await usersCollection.updateOne(query,updatedDoc)
    res.send(result)
   })
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query= {_id:new ObjectId(id)      }
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Coffee store listening on port ${port}`)
})