# Vercel Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Vercel CLI installed (`npm i -g vercel`)
- Supabase project setup

## Environment Variables Required

Add these to your Vercel project settings:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Option 2: Deploy via Git Integration
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

### Option 3: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your project
3. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables
5. Deploy

## Build Configuration

The project includes:
- `vercel.json` - Vercel deployment configuration
- SPA routing support (all routes serve index.html)
- Security headers
- Asset caching optimization

## Post-Deployment

After deployment:
1. Test all routes work correctly
2. Verify Supabase connection
3. Check that environment variables are properly configured
4. Test build process locally first: `npm run build`

## Troubleshooting

### Common Issues
1. **Build fails**: Check Node.js version compatibility
2. **Environment variables not working**: Ensure they're added in Vercel dashboard
3. **Routes not working**: SPA routing is configured in vercel.json
4. **Supabase connection issues**: Verify environment variables are correct

### Local Testing
```bash
# Test build locally
npm run build

# Preview production build
npm run preview
```