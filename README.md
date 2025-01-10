# Image Gallery

A web application for viewing and managing images from your Screenshots folder. The application is built with Angular and includes a Node.js backend server.

## Features

- View images from your Screenshots directory
- Responsive grid layout
- Image preview with full-size view
- Network accessible - view your images from any device on your local network
- QR code for easy mobile access

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
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

## Accessing the Application

1. On the same machine:
   - Open your browser and navigate to `http://localhost:4200`

2. From other devices on your network:
   - Access the QR code page at `http://[your-ip]:3000`
   - Scan the QR code with your mobile device
   - Or enter `http://[your-ip]:4200` in your browser

## Troubleshooting

If you encounter port conflicts, run these commands before starting the servers:
```bash
# Free up the required ports
fuser -k 3000/tcp  # For the backend server
fuser -k 4200/tcp  # For the Angular development server
