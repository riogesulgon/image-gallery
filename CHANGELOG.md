# Changelog

## [Unreleased]

### Added
- New `/api/server-info` endpoint in server.js to provide dynamic IP address and port information
- Dynamic IP address resolution for QR code URL generation

### Changed
- Updated ServerUrlService to fetch IP and port from server instead of using hardcoded values
- Removed unused HTTP client code from previous implementation
- Fixed network accessibility by removing hardcoded localhost references
- Updated ImageService to use dynamic server URL
- Changed server-info endpoint to return correct server port (3000)

### Technical Details

#### Modified Files
1. `server/server.js`:
   - Added new endpoint `/api/server-info` to expose server IP and port
   - Uses Node.js `os` module to dynamically detect network IP
   - Fixed port number in server-info response to use actual server port

2. `src/app/services/server-url.service.ts`:
   - Now fetches server info from backend API
   - Constructs URLs dynamically using window.location
   - Removed hardcoded localhost references

3. `src/app/services/image.service.ts`:
   - Removed hardcoded localhost URL
   - Updated to use dynamic server URL based on client location
   - Improved network accessibility

#### Commands Used
```bash
# Kill existing processes on required ports
fuser -k 3000/tcp
fuser -k 4200/tcp

# Start the backend server
cd server && npm start

# Build Angular app for production
ng build

# Start the Angular development server with network access
ng serve --host 0.0.0.0
```

#### API Response Format
```json
{
  "ip": "192.168.100.15",
  "port": 3000
}
