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

app.use(cors());

// Serve images from the Screenshots directory
app.use('/images', express.static('/home/rio/Pictures/Screenshots'));

// Get list of images
// Get server IP and port
app.get('/api/server-info', (req, res) => {
    res.json({
        ip: LOCAL_IP,
        port: PORT  // Use the actual server port
    });
});

app.get('/api/images', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 6;
        
        const files = await fs.readdir('/home/rio/Pictures/Screenshots');
        const images = files.filter(file => 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.jpeg') || 
            file.toLowerCase().endsWith('.png')
        ).sort();

        const totalImages = images.length;
        const totalPages = Math.ceil(totalImages / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalImages);
        const pagedImages = images
            .slice(startIndex, endIndex)
            .map(name => `http://${LOCAL_IP}:${PORT}/images/${encodeURIComponent(name)}`);

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
                <title>Image Gallery Server</title>
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
                    <h1>Image Gallery Server</h1>
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
