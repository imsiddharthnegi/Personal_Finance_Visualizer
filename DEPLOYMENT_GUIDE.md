# Deployment Guide - Personal Finance Visualizer

## Quick Deployment to Vercel

### Step 1: Prepare MongoDB Database

**Option A: MongoDB Atlas (Recommended for Production)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/personal-finance`

**Option B: Local MongoDB (Development)**
```bash
# Install MongoDB
sudo apt update
sudo apt install -y mongodb

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Connection string: mongodb://localhost:27017/personal-finance
```

### Step 2: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Personal Finance Visualizer"
   git branch -M main
   git remote add origin https://github.com/yourusername/personal-finance-visualizer.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variable:
     - `MONGODB_URI`: Your MongoDB connection string
   - Deploy!

### Step 3: Verify Deployment

1. Visit your deployed URL
2. Test all features:
   - Add transactions
   - View dashboard
   - Set budgets
   - Check insights

## Environment Variables

```env
# Required for deployment
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance

# Optional (for development)
NODE_ENV=production
```

## Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MONGODB_URI is correct
   - Check network access in MongoDB Atlas
   - Ensure database user has proper permissions

2. **Build Errors**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are installed

3. **Runtime Errors**
   - Check browser console for client-side errors
   - Verify API routes are working
   - Test MongoDB connection

### Performance Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes for better performance
   db.transactions.createIndex({ "date": -1 })
   db.transactions.createIndex({ "category": 1 })
   db.budgets.createIndex({ "month": 1, "category": 1 })
   ```

2. **Caching**
   - Enable Vercel Edge Caching
   - Implement client-side caching for dashboard data

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use strong MongoDB passwords
   - Restrict MongoDB network access

2. **Input Validation**
   - All forms include client and server validation
   - MongoDB queries use parameterized inputs
   - XSS protection through React's built-in escaping

## Monitoring

1. **Vercel Analytics**
   - Enable Vercel Analytics for performance monitoring
   - Monitor function execution times

2. **Error Tracking**
   - Consider adding Sentry for error tracking
   - Monitor MongoDB performance

## Scaling Considerations

1. **Database**
   - MongoDB Atlas auto-scaling
   - Connection pooling implemented
   - Efficient queries with proper indexing

2. **Frontend**
   - Static generation where possible
   - Optimized bundle sizes
   - Image optimization

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with production build
4. Check MongoDB Atlas logs

---

**Ready for Production Deployment** ✅

