const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample business data
const businesses = [
  {
    name: "Coffee Hub",
    location: "Hyderabad",
    rating: 4.5,
    reviews: 250,
    headlines: [
      "Best coffee in Hyderabad!",
      "A must-visit spot this year",
      "Top-rated local café!",
      "Why everyone loves Coffee Hub",
      "Your go-to place for fresh brews"
    ],
  },
];

// Utility: find business
function findBusiness(name, location) {
  return businesses.find(
    b =>
      b.name.toLowerCase() === name.toLowerCase() &&
      b.location.toLowerCase() === location.toLowerCase()
  );
}

// Utility: random headline
function getRandomHeadline(business) {
  const index = Math.floor(Math.random() * business.headlines.length);
  return business.headlines[index];
}

// Route: GET /
app.get('/', (req, res) => {
  res.send('Local Business API is running');
});

// POST /business-data
app.post('/business-data', (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) {
    return res.status(400).json({ error: "Missing 'name' or 'location' in request." });
  }

  const business = findBusiness(name, location);
  if (!business) {
    return res.status(404).json({ error: "Business not found." });
  }

  res.json({
    rating: business.rating,
    reviews: business.reviews,
    headline: `${business.name} in ${business.location}: ${getRandomHeadline(business)}`
  });
});

// GET /regenerate-headline
app.get('/regenerate-headline', (req, res) => {
  const { name, location } = req.query;
  if (!name || !location) {
    return res.status(400).json({ error: "Missing 'name' or 'location' in query." });
  }

  const business = findBusiness(name, location);
  if (!business) {
    return res.status(404).json({ error: "Business not found." });
  }

  res.json({
    headline: `${business.name} in ${business.location}: ${getRandomHeadline(business)}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
