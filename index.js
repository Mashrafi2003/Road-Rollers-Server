const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port =process.env.PORT || 5000
const { MongoClient } = require('mongodb');

//MiddleWare
app.use(cors());
app.use(express.json());
require('dotenv').config(); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zrnlv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
      await client.connect();
        console.log('database connected')

        const database = client.db('hero');
        const cycleCollection = database.collection('cycle');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users')
        const reviewCollection = database.collection('review')

        // Get Products From API
        app.get('/cycle', async(req , res)=>{
          const cursor = cycleCollection.find({});
          const products = await cursor.toArray();
          res.send(products);
        });
        // Post A Product On Server
        app.post('/cycle', async(req,res)=>{
          const product = req.body;
          const result = await cycleCollection.insertOne(product)
          console.log(result);
          res.json(result)
        })

        // Get A Single Products Details
        app.get('/cycle/:id', async(req , res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)}
          const service = await cycleCollection.findOne(query);
          res.json(service);

        })
        // Post A Order On all Order 
        app.post('/orders', async (req,res)=>{
          const order = req.body;
          const result = await ordersCollection.insertOne(order)
          console.log(result)
          res.json(result)
      })
      // Get Orders From API
        app.get('/orders', async(req , res)=>{
          const cursor = ordersCollection.find({});
          const products = await cursor.toArray();
          res.send(products);
        });
        // Delete From API
        app.delete('/orders/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await ordersCollection.deleteOne(query);
          res.json(result);
      })

        // Post A registered Users information
        app.post('/users', async (req,res)=>{
          const user = req.body;
          const result = await usersCollection.insertOne(user)
          console.log(result)
          res.json(result);
        })
        // Get Registered Users Data
        app.get('/users', async (req, res)=>{
          const cursor = usersCollection.find({})
          const users = await cursor.toArray();
          res.send(users);
        })

        // Admin Role on USer
      app.put('/users/admin', async(req, res)=>{
        const user = req.body;
        console.log(user);
        const filter = {email : user.email};
        const updateDoc = {$set : {role:'admin'}};
        const result = await usersCollection.updateOne(filter , updateDoc)
        res.json(result);
      })
      app.get('/users/admin', async (req , res)=>{
        const cursor = usersCollection.find({})
        const users = await cursor.toArray()
        res.send(users)
      })

      app.get('/users/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === 'admin') {
            isAdmin = true;
        }
        res.json({ admin: isAdmin });
    })


        // Post review on the API
        app.post('/review', async(req,res)=>{
          const review = req.body;
          const result = await reviewCollection.insertOne(review)
          console.log(result)
          res.json(result);
        })
        // Get The Review
        app.get('/review', async(req,res)=>{
          const cursor = reviewCollection.find({});
          const reviews = await cursor.toArray();
          res.send(reviews);
        })


    }
    finally{
      // await\ client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello From Cycle Related Services')
})

app.listen(port, () => {
  console.log('Server Running At', port)
})