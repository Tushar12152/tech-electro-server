const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5001


// middleware
app.use(cors());
app.use(express.json())



//technology-electronics
//59nLoeVGQJKFNxFu




const uri = "mongodb+srv://technology-electronics:59nLoeVGQJKFNxFu@cluster0.tgzt8q2.mongodb.net/?retryWrites=true&w=majority";

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

    const ProductCollection = client.db("productsDB").collection("products");
    const CartCollection = client.db("cartsDB").collection("carts");
 

    app.post("/products",async(req,res)=>{
           const product=req.body;
           console.log(product)
           const result=await ProductCollection.insertOne(product)
           res.send(result)
    })

    app.put("/products/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const options = { upsert: true };
         const updatedProduct=req.body;
        const Product={
          $set:{
            name:updatedProduct.name,
            brand:updatedProduct.brand,
            type:updatedProduct.type,
            price:updatedProduct.price,
            description:updatedProduct.description,
            rating:updatedProduct.rating,
            photo:updatedProduct.photo,
          }
        }
        const result = await ProductCollection.updateOne(query, Product, options);
        res.send(result)
    })

    app.get('/products',async(req,res)=>{
        const cursor=ProductCollection.find();
        const result= await cursor.toArray();
        res.send(result)
    })

    app.get('/products/:id',async(req,res)=>{
           
        const id=req.params.id;
       
        const query={_id:new ObjectId(id)}
       
        const result=await ProductCollection.findOne(query)
        // console.log(result)
        res.send(result)

    })

    




    app.post("/carts", async (req, res) => {
      const cart = req.body;
    
      try {
        const result = await CartCollection.insertOne(cart);
        res.send(result);
      }
      
      catch (error) {
        // console.log(error)
        if (error.code === 11000) {
       
      res.status(400).send({ success: false, message: 'Duplicate entry' })
     

        } else {
         

          res.status(500).send({ success: false, message: error.message })
        }
      }
    })
    




    app.get('/carts',async(req,res)=>{
        const cursor= CartCollection.find()
        const result=await cursor.toArray();
        res.send(result)
    })

    app.delete('/carts/:id',async(req,res)=>{
         const id=req.params.id;
        //  console.log(id)
         const query={_id : new ObjectId(id)}
         const result=await CartCollection.deleteOne(query)
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






app.get('/',(req,res)=>{
    res.send('data will comming soon.............')
})

app.listen(port,()=>{
    console.log(`this site is going on port ${port}`)
})