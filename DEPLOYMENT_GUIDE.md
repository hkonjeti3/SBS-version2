# Deployment Guide for Vercel + Render

This guide will help you deploy the Secure Banking System (SBS) on Vercel (frontend) and Render (backend with Redis and PostgreSQL).

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Render Account**: Sign up at [render.com](https://render.com)
4. **Email Service**: Configure Gmail SMTP for email notifications

## Backend Deployment on Render

### Step 1: Deploy Backend Service

1. **Connect to GitHub**:
   - Go to [render.com](https://render.com)
   - Sign in and connect your GitHub account
   - Select your repository

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **Important**: In the service configuration, set the **Branch** to `deploy`
   - Or use the `render.yaml` file in the root directory which already specifies the deploy branch

3. **Configure Service**:
   - **Name**: `sbs-backend`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users (e.g., Oregon)
   - **Branch**: `deploy` (⚠️ **CRITICAL**: Make sure this is set to `deploy`, not `main`)
   - **Root Directory**: `SBS_Backend`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/sbs-0.0.1-SNAPSHOT.jar`

4. **Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=production
   JWT_SECRET=your-secure-jwt-secret-here
   MAIL_USERNAME=konjetisaketh24@gmail.com
   MAIL_PASSWORD=your-gmail-app-password
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

### Step 2: Create PostgreSQL Database

1. **Create Database**:
   - Go to "New +" → "PostgreSQL"
   - **Name**: `sbs-postgres`
   - **Database**: `secureBanking`
   - **User**: `sbs_user`
   - **Plan**: Free

2. **Get Connection Details**:
   - Copy the connection string
   - Note the host, port, database name, username, and password

3. **Link to Backend**:
   - Go back to your backend service
   - Add environment variable:
     ```
     SPRING_DATASOURCE_URL=postgresql://username:password@host:port/database
     ```

### Step 3: Create Redis Service

1. **Create Redis**:
   - Go to "New +" → "Redis"
   - **Name**: `sbs-redis`
   - **Plan**: Free
   - **Max Memory Policy**: `allkeys-lru`

2. **Link to Backend**:
   - Add environment variables to backend:
     ```
     SPRING_REDIS_HOST=your-redis-host
     SPRING_REDIS_PORT=your-redis-port
     SPRING_REDIS_PASSWORD=your-redis-password
     ```

## Frontend Deployment on Vercel

### Step 1: Deploy Frontend

1. **Connect to GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in and connect your GitHub account
   - Import your repository

2. **Configure Project**:
   - **Framework Preset**: `Angular`
   - **Root Directory**: `SBS_Frontend`
   - **Build Command**: `npm run build:prod`
   - **Output Directory**: `dist/bk-app`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   ```

### Step 2: Update Backend CORS

1. **Get Frontend URL**:
   - After deployment, copy your Vercel URL
   - Update the backend CORS configuration

2. **Update Backend Environment**:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

## Configuration Files

### Backend Files Created:
- `SBS_Backend/Dockerfile`: Container configuration
- `SBS_Backend/render.yaml`: Render deployment config
- `SBS_Backend/sbs/src/main/resources/application-prod.properties`: Production settings

### Frontend Files Created:
- `SBS_Frontend/vercel.json`: Vercel configuration
- Updated `SBS_Frontend/src/environments/environment.prod.ts`: Production API URL

## Post-Deployment Steps

### 1. Database Initialization
The application will automatically create tables on first run. You may need to:
- Create initial admin users
- Set up default roles and permissions

### 2. Email Configuration
Ensure your Gmail app password is correctly set in the backend environment variables.

### 3. SSL/HTTPS
Both Vercel and Render provide automatic SSL certificates.

### 4. Monitoring
- **Render**: Built-in logs and metrics
- **Vercel**: Analytics and performance monitoring

## Troubleshooting

### Branch Configuration Issues:

**Problem**: Render is using `main` branch instead of `deploy`
**Solution**: 
1. Go to your Render service dashboard
2. Click on "Settings" tab
3. Scroll down to "Build & Deploy" section
4. Change "Branch" from `main` to `deploy`
5. Click "Save Changes"
6. Trigger a new deployment

**Alternative Solution**:
- Use the `render.yaml` file in the root directory which already specifies `branch: deploy`
- Render will automatically use this configuration

### Common Issues:

1. **Build Failures**:
   - Check Maven dependencies
   - Verify Java version (17 required)
   - Check build logs in Render dashboard

2. **Database Connection**:
   - Verify PostgreSQL connection string
   - Check network connectivity
   - Ensure database is accessible

3. **CORS Errors**:
   - Update `CORS_ALLOWED_ORIGINS` with correct frontend URL
   - Check browser console for specific errors

4. **Email Issues**:
   - Verify Gmail app password
   - Check SMTP configuration
   - Test email service

### Logs and Debugging:
- **Render**: View logs in the service dashboard
- **Vercel**: Check deployment logs and function logs
- **Application**: Check `/actuator/health` endpoint

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Restrict origins to your frontend domain
3. **Rate Limiting**: Enabled in production configuration
4. **JWT Secrets**: Use strong, unique secrets
5. **Database**: Use strong passwords and restrict access

## Scaling Considerations

1. **Render Free Tier Limits**:
   - 750 hours/month for web services
   - 90 days of inactivity before suspension
   - Consider paid plans for production

2. **Vercel Free Tier**:
   - 100GB bandwidth/month
   - 100 serverless function executions/day
   - Consider Pro plan for higher limits

## Cost Optimization

1. **Render**:
   - Use free tier for development
   - Upgrade only when needed
   - Monitor usage in dashboard

2. **Vercel**:
   - Free tier sufficient for most projects
   - Pay only for overages
   - Use edge functions for better performance

## Maintenance

1. **Regular Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Update environment variables as needed

2. **Backup Strategy**:
   - Render PostgreSQL includes backups
   - Consider additional backup solutions
   - Test restore procedures

3. **Monitoring**:
   - Set up alerts for downtime
   - Monitor performance metrics
   - Track error rates

## Support

- **Render**: [docs.render.com](https://docs.render.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Angular**: [angular.io/docs](https://angular.io/docs)
- **Spring Boot**: [spring.io/projects/spring-boot](https://spring.io/projects/spring-boot) 