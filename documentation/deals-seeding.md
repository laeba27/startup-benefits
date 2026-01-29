# Deals & Seeding Guide

## Overview
This guide explains how to seed dummy deals into MongoDB and use the Deals API endpoints.

---

## Seeding Dummy Deals

### Method 1: Using the API Endpoint (Easiest)

Once the backend server is running, you can seed deals by making a POST request to the seed endpoint.

**Endpoint:**
```
POST /api/deals/seed
```

**cURL Example:**
```bash
curl -X POST http://localhost:8080/api/deals/seed \
  -H "Content-Type: application/json"
```

**JavaScript/Fetch Example:**
```javascript
fetch('http://localhost:8080/api/deals/seed', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 10 dummy deals",
  "count": 10,
  "data": [
    {
      "_id": "...",
      "name": "GitHub Pro",
      "category": "Developer Tools",
      "value": 12,
      ...
    },
    ...
  ]
}
```

---

### Method 2: Using the CLI Script

If you have MongoDB connection issues with the API, use the CLI script:

**Prerequisites:**
- Ensure MongoDB connection is working
- Ensure `MONGODB_URI` is set in `.env`

**Run:**
```bash
cd backend
npm run seed
```

**Output:**
```
    Connected to MongoDB
🗑️  Cleared existing deals
    Successfully inserted 10 dummy deals

📋 Sample Deals Added:

1. GitHub Pro
   Category: Developer Tools
   Value: $12
   Company: GitHub
   Restricted: No

...
```

---

## Dummy Deals Included

### 10 Starter Deals:

1. **GitHub Pro** - $12/month
   - Developer Tools
   - Free for 1 year
   - Public deal

2. **AWS Activate** - $100,000 in credits
   - Cloud Services
   - Up to $100k credits
   - Restricted (requires verification)

3. **Figma Professional** - $12/month
   - Design
   - Free for 1 year
   - Public deal

4. **Stripe Free Processing** - Up to $5,000 saved
   - Cloud Services
   - Waived fees
   - Restricted (requires verification)

5. **Slack Pro** - $8/month
   - Productivity
   - Free for 2 years
   - Public deal

6. **Notion Business Plus** - $16/month
   - Productivity
   - Free for 1 year
   - Public deal

7. **Intercom Standard** - $21/month
   - Marketing
   - Free for 1 year
   - Public deal

8. **MongoDB Atlas** - $1,000 in credits
   - Databases
   - Free credits
   - Restricted (requires verification)

9. **Auth0 Pro** - $100/month
   - Security
   - Free for 1 year
   - Public deal

10. **Datadog Premium** - $15/month
    - DevOps
    - Free for 6 months
    - Public deal

---

## Deals API Endpoints

### 1. Get All Deals
```
GET /api/deals
```

**Query Parameters:**
- `category` (optional) - Filter by category
- `isRestricted` (optional) - Filter by restriction (true/false)
- `search` (optional) - Search by name, description, company, or tags

**Example:**
```bash
# Get all deals
curl http://localhost:8080/api/deals

# Get all public deals
curl http://localhost:8080/api/deals?isRestricted=false

# Get all developer tools
curl http://localhost:8080/api/deals?category=Developer%20Tools

# Search for GitHub
curl http://localhost:8080/api/deals?search=github
```

**Response:**
```json
{
  "success": true,
  "message": "Deals retrieved successfully",
  "count": 10,
  "data": [
    {
      "_id": "...",
      "name": "GitHub Pro",
      "description": "Free GitHub Pro for 1 year...",
      "category": "Developer Tools",
      "value": 12,
      "discount": 100,
      "company": "GitHub",
      "link": "https://github.com/startups",
      "couponCode": "STARTUP2024",
      "isRestricted": false,
      "expirationDate": "2025-12-31T00:00:00.000Z",
      "requirements": [...],
      "benefits": [...],
      "tags": [...],
      "createdAt": "2024-01-29T...",
      "updatedAt": "2024-01-29T..."
    },
    ...
  ]
}
```

---

### 2. Get Single Deal by ID
```
GET /api/deals/:id
```

**Example:**
```bash
curl http://localhost:8080/api/deals/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "Deal retrieved successfully",
  "data": { /* deal object */ }
}
```

---

### 3. Get Deals by Category
```
GET /api/deals/category/:category
```

**Available Categories:**
- Developer Tools
- Analytics
- Design
- Marketing
- Productivity
- Cloud Services
- Security
- Databases
- DevOps
- Other

**Example:**
```bash
curl http://localhost:8080/api/deals/category/Developer%20Tools
```

---

### 4. Get Deals Statistics
```
GET /api/deals/stats/overview
```

**Example:**
```bash
curl http://localhost:8080/api/deals/stats/overview
```

**Response:**
```json
{
  "success": true,
  "message": "Deals statistics retrieved successfully",
  "data": {
    "totalDeals": 10,
    "restrictedDeals": 3,
    "publicDeals": 7,
    "totalValue": 107129,
    "categories": [
      "Developer Tools",
      "Cloud Services",
      "Design",
      "Productivity",
      "Marketing",
      "Databases",
      "Security",
      "DevOps"
    ]
  }
}
```

---

### 5. Search Deals with Advanced Filters
```
GET /api/deals/search/query
```

**Query Parameters:**
- `q` - Search query (searches name, description, company, tags)
- `category` - Filter by category
- `priceMin` - Minimum deal value
- `priceMax` - Maximum deal value

**Example:**
```bash
# Search for design tools under $50/month
curl "http://localhost:8080/api/deals/search/query?q=design&category=Design&priceMax=50"

# Search for cloud services
curl "http://localhost:8080/api/deals/search/query?q=cloud"

# Find deals worth $100+
curl "http://localhost:8080/api/deals/search/query?priceMin=100"
```

---

## Deal Data Structure

```typescript
interface Deal {
  _id: ObjectId;
  name: string;                    // Deal name
  description: string;             // Deal description
  category: string;                // Category (enum)
  value: number;                   // Monthly/annual value in USD
  discount: number;                // Discount percentage (0-100)
  company: string;                 // Company name
  logo: string;                    // Company logo URL
  link: string;                    // Link to claim deal
  couponCode?: string;             // Optional coupon code
  isRestricted: boolean;           // Requires verification
  restrictionDetails?: string;     // Who can access
  expirationDate: Date;            // When deal expires
  requirements?: string[];         // Requirements to claim
  benefits?: string[];             // Key benefits
  tags?: string[];                 // Search tags
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Frontend Integration

### Example: Fetch All Deals
```typescript
// app/deals/page.tsx
import { useEffect, useState } from 'react';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/deals`
        );
        const data = await response.json();
        setDeals(data.data);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) return <div>Loading deals...</div>;

  return (
    <div>
      <h1>Available Deals ({deals.length})</h1>
      <div className="grid">
        {deals.map(deal => (
          <div key={deal._id} className="card">
            <h3>{deal.name}</h3>
            <p>{deal.description}</p>
            <p>Value: ${deal.value}</p>
            <p>Company: {deal.company}</p>
            {deal.isRestricted && <span>Restricted</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Database Clean Up

To remove all deals and start fresh:

```bash
# Using MongoDB Compass
# Collections > deals > Delete all documents

# Or using MongoDB CLI
# mongo
# use startup-benefit
# db.deals.deleteMany({})
```

---

## Troubleshooting

**Issue:** Seed endpoint returns 500 error
- **Solution:** Ensure MongoDB is connected and running. Check logs for connection errors.

**Issue:** Cannot seed deals CLI script
- **Solution:** Ensure `MONGODB_URI` is set in `.env` and MongoDB Atlas IP whitelist includes your machine.

**Issue:** Deals not appearing in database
- **Solution:** Verify MongoDB connection is working by checking backend logs.

---

## Production Considerations

⚠️ **Important:** The seed endpoint is public for development. In production:

1. Add authentication check (admin-only)
2. Move seeding to admin panel
3. Remove public seed endpoint
4. Implement seed data in deployment script

Example (production):
```typescript
// Only allow admin users
router.post('/seed', authenticateToken, async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // ... seed logic
});
```

---
