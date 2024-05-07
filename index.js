require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwouc.mongodb.net/pc-builder-app?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db('pc-builder-app');
    const userCollection = db.collection('user');

//Product Section
    const productCollection = db.collection('product');

    app.get('/product', async (req, res) => {
      const cursor = productCollection.find({});
      const book = await cursor.toArray();

      res.send({ status: true, data: book });
    });

    app.post('/product', async (req, res) => {
      const book = req.body;

      const result = await productCollection.insertOne(book);

      res.send(result);
    });
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });
      console.log(result);
      res.send(result);
    });


    


    // app.put('/update-book/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updates = req.body;

    //   const result = await bookCollection.findOneAndUpdate(
    //     { _id: ObjectId(id) },
    //     { $set: updates },
    //     { returnDocument: 'after' }
    //   );
    //   console.log(result);
    //   res.send(result);
    // });

    

    // app.delete('/book/:id', async (req, res) => {
    //   const id = req.params.id;
    //   console.log('Received id:', id);
    
    //   try {
    //     const result = await bookCollection.deleteOne({ _id: ObjectId(id) });
    //     console.log(result);
    //     res.send(result);
    //   } catch (error) {
    //     console.error('Error deleting book:', error);
    //     res.status(500).json({ error: 'An error occurred while deleting the book' });
    //   }
    // });

    

    app.post('/user', async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
