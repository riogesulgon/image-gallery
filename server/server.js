const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const QRCode = require('qrcode');
const os = require('os');

// Get local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIP();
const app = express();
const PORT = 3000;

// Default image directory
let imageDirectory = '/home/rio/Pictures/Screenshots';

app.use(cors());
app.use(express.json());

// Dynamically serve images from the current image directory
app.use('/images', (req, res, next) => {
    console.log('Image request:', req.url);
    console.log('Serving from directory:', imageDirectory);
    
    // Create a new static middleware for each request to ensure it uses the current directory
    const staticMiddleware = express.static(imageDirectory, {
        fallthrough: false,  // Return 404 if file not found
        index: false,        // Disable directory index
        redirect: false      // Disable redirects
    });
    
    // Handle the request
    staticMiddleware(req, res, err => {
        if (err) {
            console.error('Error serving image:', err);
            console.error('Full path:', path.join(imageDirectory, req.url));
            res.status(404).send('Image not found');
        }
    });
});

// Get server IP and port
app.get('/api/server-info', (req, res) => {
    res.json({
        ip: LOCAL_IP,
        port: PORT,
        imageDirectory  // Include current image directory in response
    });
});

// Update image directory
app.post('/api/update-directory', async (req, res) => {
    console.log('Received update directory request:', req.body);
    const { directory } = req.body;
    
    if (!directory) {
        console.error('Directory path is missing in request');
        return res.status(400).json({ error: 'Directory path is required' });
    }

    try {
        console.log('Attempting to access directory:', directory);
        // Verify the directory exists and is readable
        await fs.access(directory, fs.constants.R_OK);
        
        // Additional check to verify it's a directory
        const stats = await fs.stat(directory);
        if (!stats.isDirectory()) {
            console.error('Path exists but is not a directory:', directory);
            return res.status(400).json({ error: 'Path exists but is not a directory' });
        }

        // Update the directory path
        imageDirectory = directory;
        console.log('Successfully updated image directory to:', imageDirectory);
        
        res.json({ 
            success: true, 
            imageDirectory,
            message: 'Directory updated successfully'
        });
    } catch (error) {
        console.error('Error updating directory:', error);
        res.status(400).json({ 
            error: 'Invalid directory path or insufficient permissions',
            details: error.message
        });
    }
});

// Delete image endpoint
app.delete('/api/images', async (req, res) => {
    try {
        const imagePath = req.query.path;
        if (!imagePath) {
            return res.status(400).json({ error: 'Image path is required' });
        }

        // Decode the URL-encoded path and get the filename
        const decodedPath = decodeURIComponent(imagePath);
        const filename = decodedPath.replace('/images/', '');
        const fullPath = path.join(imageDirectory, filename);

        console.log('Attempting to delete image:', fullPath);

        // Verify the file exists and is within the image directory
        if (!fullPath.startsWith(imageDirectory)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        try {
            await fs.access(fullPath, fs.constants.W_OK);
        } catch (err) {
            console.error('File access error:', err);
            return res.status(404).json({ error: 'Image not found or not accessible' });
        }

        // Delete the file
        await fs.unlink(fullPath);
        console.log('Successfully deleted image:', fullPath);
        
        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image', details: error.message });
    }
});

app.get('/api/images', async (req, res) => {
    try {
        console.log('Current image directory:', imageDirectory);
        
        // Check if directory exists and is readable
        try {
            await fs.access(imageDirectory, fs.constants.R_OK);
            console.log('Directory is accessible');
        } catch (err) {
            console.error('Directory access error:', err);
            return res.status(500).json({ error: 'Cannot access image directory' });
        }
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = 12;
        
        const files = await fs.readdir(imageDirectory);
        console.log('Files in directory:', files);
        
        const images = files.filter(file => {
            const isImage = file.toLowerCase().endsWith('.jpg') ||
                          file.toLowerCase().endsWith('.jpeg') ||
                          file.toLowerCase().endsWith('.png');
            if (isImage) {
                console.log('Found image:', file);
            }
            return isImage;
        }).sort();
        
        console.log('Filtered images:', images);

        const totalImages = images.length;
        const totalPages = Math.ceil(totalImages / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalImages);
        const pagedImages = images
            .slice(startIndex, endIndex)
            .map(name => {
                // Log the image path for debugging
                const imagePath = `/images/${encodeURIComponent(name)}`;
                console.log('Image path:', imagePath);
                return imagePath;
            });

        res.json({
            images: pagedImages,
            totalImages,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ error: 'Failed to read images' });
    }
});

// Serve QR code page
app.get('/', async (req, res) => {
    const serverUrl = `http://${LOCAL_IP}:${PORT}`;
    try {
        const qrDataUrl = await QRCode.toDataURL(serverUrl);
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Browsa</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f0f0f0;
                    }
                    .container {
                        text-align: center;
                        background-color: white;
                        padding: 2rem;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    img {
                        max-width: 300px;
                        margin: 20px 0;
                    }
                    .url {
                        margin: 20px 0;
                        padding: 10px;
                        background-color: #f8f8f8;
                        border-radius: 5px;
                        word-break: break-all;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Scan this QR code to access the gallery:</p>
                    <img src="${qrDataUrl}" alt="QR Code">
                    <div class="url">
                        <strong>Server URL:</strong><br>
                        ${serverUrl}
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error generating QR code');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://${LOCAL_IP}:${PORT}`);
});
