# Startup Benefits Platform

A full-stack SaaS platform providing exclusive deals and partnerships for early-stage startups.

## Features

- 🔐 Passwordless authentication with magic links
- 💼 Exclusive SaaS deals for startups
- 📊 User dashboard with claims tracking
- 🎯 Deal categories (Cloud, Marketing, Analytics, Security, etc.)
- 🔒 Public and restricted deals based on verification
- 📱 Fully responsive design
- ✨ Beautiful animations with Framer Motion

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Magic Links
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/startup-benefits.git
   cd startup-benefits
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp ../.env.example .env
   # Edit .env with your values
   
   # Build TypeScript
   npm run build
   
   # Seed database with sample deals (optional)
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Copy environment variables
   cp ../.env.example .env.local
   # Edit .env.local with your backend URL
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Quick Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

**Fastest option** (Vercel + Railway):
1. Push to GitHub
2. Deploy backend to Railway → Add MongoDB plugin
3. Deploy frontend to Vercel → Add backend URL
4. Done! 🚀

## Docker Deployment

```bash
# Create .env file in root with your variables
cp .env.example .env

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

## API Documentation

See [documentation/api.md](documentation/api.md) for full API reference.

## Project Structure

```
startup-benefit/
├── backend/              # Express.js API
├── frontend/             # Next.js application  
├── documentation/        # Project docs
├── docker-compose.yml   # Docker setup
├── DEPLOYMENT.md        # Deployment guide
└── README.md
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details.

---

Built with laeba for startups by startups
