const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();
// middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifrt9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("geniusCar").collection("service");
    const orderCollection = client.db("geniusCar").collection("order")
    // all services
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // single servics
    app.get("/service/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service)
    })

    // POST data 
    app.post("/service" , async(req,res)=>{
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result)
    })
    // order collection api
    app.get('/order', async (req,res) =>{
      const email = req.query.email;
      const query = {email:email};
      const cursor = orderCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post('/order' , async (req,res)=>{
      const order = req.body;
      const result = await orderCollection.insertOne(order)
      res.send(result)
    })

  } 
  finally {
  }
}

run().catch(console.dir);
// get text for server

app.get("/", (req, res) => {
  res.send("Genius car server running...");
});

app.listen(port, () => {
  console.log("Listening port", port);
});
