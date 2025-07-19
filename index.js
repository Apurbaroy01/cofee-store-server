const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

console.log(process.env.DB_PASS)



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://adrikaroy487:${process.env.DB_PASS}@cluster0.znyn8om.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("Coffee");

        const userCollection = client.db("coffeeDB").collection("users");
        const odderCollection = client.db("coffeeDB").collection("oders");

        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            console.log(coffee);
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result);
        })

        //firebase user data & login user to mongoDB
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            res.send(result)

        })
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)

        })
        app.patch('/users', async (req, res) => {
            const email = req.body.email
            console.log(email)
            const query = { email }
            const updateDoc = {
                $set: {
                    lastSignInTime: req.body.LoginTime
                },
            };
            const result = await userCollection.updateOne(query, updateDoc);
            res.send(result)


        })
        // ------------------


        app.get('/coffee', async (req, res) => {
            const result = await coffeeCollection.find().toArray();
            res.send(result);

        });
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);

        })
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        });
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const coffee = req.body;
            console.log(id, coffee)
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    coffeeName: coffee.coffeeName,
                    supplierName: coffee.supplierName,
                    category: coffee.category,
                    quantity: coffee.quantity,
                    price: coffee.price,
                    details: coffee.details,
                    photo: coffee.photo,

                }
            }
            const result = await coffeeCollection.updateOne(query, updateDoc, options);
            res.send(result);

        });

        // odder collection
        app.post('/oders', async (req, res) => {
            const oders = req.body;
            console.log(oders);
            const result = await odderCollection.insertOne(oders);
            res.send(result);
        })
        app.get('/oders', async (req, res) => {
           const result = await odderCollection.find().toArray();
            res.send(result); 
        })




        console.log("You successfully connected to MongoDB!✅");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
run();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
