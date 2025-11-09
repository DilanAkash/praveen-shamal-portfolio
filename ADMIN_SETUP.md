# Admin Panel Setup Guide

This guide will help you set up the admin panel for managing your portfolio content.

## Prerequisites

1. A Sanity account and project
2. Admin access to your Sanity project

## Step 1: Get Your Sanity Write Token

1. Go to [Sanity Management Console](https://sanity.io/manage)
2. Select your project (praveen-shamal-portfolio)
3. Navigate to **API** → **Tokens**
4. Click **Create new token**
5. Give it a name (e.g., "Admin Panel Token")
6. Select **Editor** permissions (this allows creating, updating, and deleting documents)
7. Copy the token (you won't be able to see it again!)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example`)
2. Add your Sanity write token:

```env
VITE_SANITY_PROJECT_ID=38uy7m8l
VITE_SANITY_DATASET=production
VITE_SANITY_WRITE_TOKEN=your_actual_token_here
VITE_ADMIN_PASSWORD=your_secure_password_here
```

3. **Important**: Change `VITE_ADMIN_PASSWORD` to a strong password
4. Never commit the `.env` file to git (it's already in `.gitignore`)

## Step 3: Start the Development Server

```bash
npm run dev
```

## Step 4: Access the Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Enter your admin password (set in `VITE_ADMIN_PASSWORD`)
3. You'll be redirected to the dashboard

## Admin Panel Features

### Dashboard (`/admin`)
- View all portfolio projects
- See project thumbnails, titles, and categories
- Quick access to edit or delete projects
- Add new projects

### Add Project (`/admin/new`)
- Upload images
- Set title, category, and description
- Images are automatically uploaded to Sanity
- Optimized for web (WebP format)

### Edit Project (`/admin/edit/:id`)
- Update project details
- Replace images
- Modify categories and descriptions

### Delete Projects
- Confirm before deleting
- Immediate removal from Sanity
- Cannot be undone (be careful!)

## Security Notes

1. **Password Security**: The admin password is stored in an environment variable. For production, consider using a more secure authentication method (OAuth, JWT, etc.)

2. **Token Security**: 
   - Never commit your write token to git
   - Use environment variables
   - Rotate tokens periodically
   - Use the minimum required permissions (Editor, not Admin)

3. **Production Deployment**:
   - Set environment variables in your hosting platform
   - Use strong passwords
   - Consider adding rate limiting
   - Enable HTTPS

## Troubleshooting

### "Admin client not configured" Error
- Make sure `VITE_SANITY_WRITE_TOKEN` is set in your `.env` file
- Restart your development server after adding environment variables
- Check that the token has Editor permissions

### Images Not Uploading
- Verify your write token has the correct permissions
- Check your internet connection
- Ensure image files are valid (JPG, PNG, WebP, etc.)

### Can't Login
- Check that `VITE_ADMIN_PASSWORD` is set correctly
- Clear browser localStorage if needed
- Default password is "admin123" if not set

## Support

For issues with:
- **Sanity**: Check [Sanity Documentation](https://www.sanity.io/docs)
- **Admin Panel**: Check the browser console for error messages
- **Authentication**: Verify environment variables are loaded correctly

## Next Steps

Consider adding:
- User roles and permissions
- Activity logs
- Bulk operations
- Image optimization settings
- Gallery image reordering
- Draft/publish workflow

