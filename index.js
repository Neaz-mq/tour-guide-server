const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zyo6s3.mongodb.net/?retryWrites=true&w=majority`;





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
    await client.connect();

    const tourCollection = client.db('tourDB').collection('tours');

    const serviceCollection = client.db('tourDB').collection('service');

    const userCollection = client.db('tourDB').collection('user');


    app.get('/tours', async (req, res) => {
      const cursor = tourCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    app.get('/tours/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }

      const options = {
        
        // Include only the `title` and `imdb` fields in the returned document
        projection: {  price: 1, image: 1, name: 1, description: 1, providerimg: 1, provider: 1
        },
      };



      const result = await tourCollection.findOne(query, options);
      res.send(result);


    })


    // Service

    app.get('/service', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })


    


    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query);
      res.send(result);


    })

    app.post('/service', async (req, res) => {
      const newService = req.body;
      console.log(newService);
      const result = await serviceCollection.insertOne(newService);
      res.send(result);

    })

    app.put('/service/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id) }
      const options = { upsert: true };
      const updateService = req.body;
      const service = {
        $set: {
          photo: updateService.photo,
          title: updateService.title,
          name: updateService.name,
          email: updateService.email,
          price: updateService.price,
          area: updateService.area,
          details: updateService.details
        },
      }
      const result = await serviceCollection.updateOne(filter, service, options);
      res.send(result);

    })

    app.delete('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
  })



// user related apis

app.get('/user', async(req, res) =>{
  const cursor = userCollection.find();
  const users = await cursor.toArray();
  res.send(users)
 
})
app.post('/user', async(req, res) =>{
  const user = req.body;
  console.log(user);
  const result = await userCollection.insertOne(user);
  res.send(result);
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


// middleware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Tour and Guide')
})

app.listen(port, () => {
    console.log(`Tour server is running ${port}`);
})