const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://mongo_db:27017/dealershipsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB successfully");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

app.get('/', (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error("Error fetching reviews", error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch reviews by dealer ID - Modified to handle numeric ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const id = parseInt(req.params.id); // Added parsing to integer
  try {
    const documents = await Reviews.find({dealership: id});
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents by dealer", error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    console.error("Error fetching dealership data", error);
    res.status(500).json({ error: 'Error fetching dealership data' });
  }
});

// Fetch Dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  const state = req.params.state;
  try {
    const dealers = await Dealerships.find({state: state});
    res.json(dealers);
  } catch (error) {
    console.error("Error fetching dealerships by state", error);
    res.status(500).json({ error: 'Error fetching dealerships data by state' });
  }
});

// Fetch dealer details by ID - Modified to match numeric ID
app.get('/fetchDealer/:id', async (req, res) => {
  const id = parseInt(req.params.id); // Added parsing to integer
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required and must be a number' });
  }
  try {
    const dealer = await Dealerships.findOne({ id: id }); // Query modified to use numeric id
    if (dealer) {
      res.json(dealer);
    } else {
      res.status(404).json({ error: 'Dealer Not Found!' });
    }
  } catch (error) {
    console.error("Error fetching dealership data by ID", error);
    res.status(500).json({ error: 'Error fetching dealership data by ID' });
  }
});

// Insert a review
app.post('/insert_review', async (req, res) => {
  const data = req.body;
  const lastReview = await Reviews.findOne().sort({ id: -1 });
  let new_id = lastReview ? lastReview.id + 1 : 1;

  const review = new Reviews({
    id: new_id,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year,
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error("Error inserting review", error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
