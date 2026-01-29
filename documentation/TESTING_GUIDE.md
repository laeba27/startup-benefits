# Testing Guide - Dashboard & Deals

## 🚀 Quick Start (5 minutes)

### 1. Start Backend Server
```bash
cd /Users/laebafirdous/Desktop/webdev/startup-benefit/backend
npm run dev
```

**Expected Output:**
```
    Server running on port 8080
    Connected to MongoDB
```

### 2. Seed Dummy Deals
In a **new terminal**:
```bash
curl -X POST http://localhost:8080/api/deals/seed \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 10 dummy deals",
  "count": 10,
  "data": [...]
}
```

### 3. Start Frontend
In another **new terminal**:
```bash
cd /Users/laebafirdous/Desktop/webdev/startup-benefit/frontend
npm run dev
```

**Expected Output:**
```
    Frontend running on http://localhost:3001
```

---

## 📡 API Testing

### Test 1: Get All Deals
```bash
curl http://localhost:8080/api/deals
```

**Expected:**
-     Returns array of 10 deals
-     Each deal has all properties (name, description, category, value, etc.)
-     Status code: 200

### Test 2: Get Deals Statistics
```bash
curl http://localhost:8080/api/deals/stats/overview
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalDeals": 10,
    "restrictedDeals": 3,
    "publicDeals": 7,
    "totalValue": 107129,
    "categories": [...]
  }
}
```

### Test 3: Filter by Category
```bash
curl "http://localhost:8080/api/deals?category=Developer%20Tools"
```

**Expected:**
- Returns only Developer Tools deals
- Should return GitHub Pro, Auth0 Pro in results

### Test 4: Filter by Restriction Status
```bash
# Get only public deals
curl "http://localhost:8080/api/deals?isRestricted=false"

# Get only restricted deals
curl "http://localhost:8080/api/deals?isRestricted=true"
```

**Expected:**
- Public deals query returns 7 deals
- Restricted query returns 3 deals

### Test 5: Search Functionality
```bash
# Search for "github"
curl "http://localhost:8080/api/deals?search=github"

# Search for "cloud"
curl "http://localhost:8080/api/deals?search=cloud"
```

**Expected:**
-     Search is case-insensitive
-     Returns matching deals
-     Status code: 200

### Test 6: Advanced Search
```bash
# Find cloud services worth more than $100
curl "http://localhost:8080/api/deals/search/query?q=cloud&priceMin=100"
```

**Expected:**
- Returns AWS Activate and Stripe deals

### Test 7: Get Single Deal
```bash
# Replace DEAL_ID with actual ID from a deal
curl http://localhost:8080/api/deals/DEAL_ID
```

**Expected:**
- Returns full deal object
- Status code: 200

### Test 8: Get Deals by Category
```bash
curl "http://localhost:8080/api/deals/category/Cloud%20Services"
```

**Expected:**
- Returns AWS Activate, Stripe, MongoDB deals

---

## 🌐 Frontend Testing

### Test 1: Navigate to Deals Page
1. Open `http://localhost:3001`
2. Look for "Deals" or "Explore Deals" link
3. Click to navigate to deals page

**Expected:**
-     Page loads without errors
-     Deals are displayed from API

### Test 2: Dashboard Access
1. Register/Login if needed
2. Navigate to `/dashboard`
3. View user profile section

**Expected:**
-     User profile displays correctly
-     Navbar shows user avatar with initials
-     Dashboard layout looks clean

### Test 3: Navigation Testing
1. Check navbar avatar
2. Click avatar dropdown
3. View menu options (Dashboard, Profile, Logout)

**Expected:**
-     Avatar shows first letters of name (e.g., "JD" for John Doe)
-     Dropdown menu appears smoothly
-     All menu items are clickable

---

## 🛠️ Debugging Tips

### If Backend Won't Start:
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill process using port 8080 (replace PID)
kill -9 PID

# Try again
npm run dev
```

### If Seed Fails:
```bash
# Check MongoDB connection
echo $MONGODB_URI

# Verify connection string is valid
# Should look like: mongodb+srv://username:password@cluster.mongodb.net/database

# Try seeding again
curl -X POST http://localhost:8080/api/deals/seed
```

### If Frontend Can't Connect to Backend:
1. Ensure backend is running on port 8080
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env`
3. Should be `http://localhost:8080`

### If Deals Aren't Showing:
1. Check browser console for errors (F12)
2. Check backend logs for API errors
3. Verify seed was successful
4. Check Network tab in DevTools to see API response

---

## 📊 Expected Database State

After seeding, MongoDB should have:

### Deals Collection
- **10 documents** in `deals` collection
- Each with properties:
  - name (string)
  - description (string)
  - category (string)
  - value (number)
  - isRestricted (boolean)
  - expirationDate (date)
  - createdAt (date)
  - updatedAt (date)

### Sample Deal:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "GitHub Pro",
  "description": "Free GitHub Pro for 1 year...",
  "category": "Developer Tools",
  "value": 12,
  "discount": 100,
  "company": "GitHub",
  "logo": "https://...",
  "link": "https://github.com/startups",
  "couponCode": "STARTUP2024",
  "isRestricted": false,
  "expirationDate": "2025-12-31T00:00:00.000Z",
  "requirements": ["Startup verification", "Less than 3 years old"],
  "benefits": [
    "Unlimited private repositories",
    "Advanced CI/CD",
    "Code security and analysis"
  ],
  "tags": ["development", "version-control", "devops"],
  "createdAt": "2024-01-29T12:00:00.000Z",
  "updatedAt": "2024-01-29T12:00:00.000Z"
}
```

---

##     Verification Checklist

- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] Seed endpoint returns 201 status
- [ ] 10 deals are created in database
- [ ] GET /api/deals returns all deals
- [ ] Statistics endpoint works
- [ ] Search functionality filters correctly
- [ ] Frontend loads without errors
- [ ] Navbar displays with user avatar
- [ ] Dashboard page accessible
- [ ] No console errors in browser

---

## 🔗 Quick Links

- **Backend Logs:** Check terminal where `npm run dev` is running
- **Database:** MongoDB Atlas console at https://cloud.mongodb.com
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:8080
- **API Docs:** See `documentation/api.md`
- **Seeding Guide:** See `documentation/deals-seeding.md`

---

## 📝 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| EADDRINUSE (port in use) | Kill process on port 8080 or change PORT in .env |
| MongoDB connection error | Check MONGODB_URI in .env and IP whitelist |
| CORS errors | Ensure FRONTEND_URL is correct in backend .env |
| Empty deals list | Run seed endpoint or check if deals are in database |
| Avatar not showing | Ensure user is logged in and has a name |
| Page not loading | Check browser console for errors |

---

## 🎯 Testing Workflow

### Complete Test Flow (15 minutes):

1. **Start Backend**    
   - `npm run dev` in backend folder
   - Wait for "Server running" message

2. **Seed Data**    
   - `curl -X POST http://localhost:8080/api/deals/seed`
   - Verify response shows 10 deals

3. **Test APIs**    
   - Test each endpoint in browser or Postman
   - Verify data comes back correctly

4. **Start Frontend**    
   - `npm run dev` in frontend folder
   - Wait for "Ready in X.Xs"

5. **Register/Login**    
   - Create account or login
   - Verify JWT token received

6. **Test Dashboard**    
   - Navigate to dashboard
   - See profile and avatar
   - Check page breadcrumb

7. **Test Navigation**    
   - Use navbar to navigate pages
   - Click avatar dropdown
   - Verify active page indicator

---

## 💡 Pro Tips

- Use **Postman** or **Thunder Client** for easier API testing
- Keep **3 terminals** open: backend, frontend, and general commands
- Use **curl -i** to see response headers and status codes
- Use **browser DevTools** (F12) to debug frontend issues
- Check **MongoDB Atlas console** to verify deals in database

---

## 📞 Support

If something isn't working:

1. **Check the logs** - backend terminal shows errors
2. **Check browser console** - F12 to see frontend errors
3. **Check MongoDB Atlas** - verify data is there
4. **Verify URLs** - API URL, frontend URL are correct
5. **Check .env files** - all variables are set correctly

---

**Last Updated:** January 29, 2024
**Status:**     All systems ready for testing
