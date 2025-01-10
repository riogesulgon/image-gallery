# Browsa v1.1.0

A web application for viewing and managing images from any directory on your system. Built with Angular and Node.js, this application provides a responsive, network-accessible interface for browsing and viewing your image collections.

## Features

- View images from any directory on your system
- Configurable image source directory with real-time updates
- Responsive grid layout with pagination
- Image preview with full-size view
- Network accessible - view your images from any device on your local network
- QR code for easy mobile access
- Context menu for enhanced image interaction
- Mobile-friendly with long press support
- Comprehensive error handling and user feedback
- Real-time directory validation and access checks
- Automatic gallery refresh on directory changes

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)
- Read access to image directories you want to browse

## Installation

1. Clone the repository:
```bash
git clone https://github.com/riogesulgon/image-gallery.git
cd image-gallery
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. In a new terminal, build and serve the Angular application:
```bash
# Build the app for production
ng build

# Serve the app with network access
ng serve --host 0.0.0.0
```

The application will start with the default image directory set to `/home/rio/Pictures/Screenshots`. You can change this through the UI once the application is running.

## Accessing the Application

1. On the same machine:
   - Open your browser and navigate to `http://localhost:4200`
   - The application will display images from the default directory
   - Use the directory input field in the header to change the image source directory

2. From other devices on your network:
   - Access the QR code page at `http://[your-ip]:3000`
   - Scan the QR code with your mobile device
   - Or enter `http://[your-ip]:4200` in your browser

## Mobile Features

1. Long Press:
   - Press and hold an image to open the context menu
   - Access additional options without right-clicking
   - Smooth interaction optimized for touch devices

2. Context Menu:
   - Quick access to image actions
   - Open image in new tab
   - Download image
   - Copy image URL

## Changing Image Directory

1. Locate the directory input field in the application header
2. Enter the full path to your desired image directory
3. Click "Update Directory"
4. The gallery will automatically refresh to show images from the new directory

The application validates the directory path and provides feedback if:
- The path doesn't exist
- The path exists but isn't a directory
- You don't have read permissions for the directory

## Troubleshooting

### Port Conflicts
If you encounter port conflicts, run these commands before starting the servers:
```bash
# Free up the required ports
fuser -k 3000/tcp  # For the backend server
fuser -k 4200/tcp  # For the Angular development server
```

### Directory Access Issues
If you're having trouble accessing a directory:
1. Ensure the directory exists and contains images
2. Check that you have read permissions for the directory
3. Verify the path is entered correctly
4. Check the browser console and server logs for detailed error messages

### Image Loading Issues
If images aren't loading:
1. Verify the images are in supported formats (JPG, JPEG, PNG)
2. Check the browser console for any loading errors
3. Ensure the server has access to the image directory
4. Try refreshing the gallery using the directory update button

## Logging

The application provides comprehensive logging to help diagnose issues:
- Frontend logs are available in the browser console
- Backend logs are displayed in the server terminal
- Directory access attempts and errors are logged
- Image loading successes and failures are tracked
