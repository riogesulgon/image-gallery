# Changelog

## [1.0.0] - 2024-03-19

### Initial Release

### Added
- New `/api/server-info` endpoint in server.js to provide dynamic IP address and port information
- Dynamic IP address resolution for QR code URL generation
- Configurable image directory path through UI
- New `/api/update-directory` endpoint to change image source directory
- Directory path display and update interface in the header

### Changed
- Updated ServerUrlService to fetch IP and port from server instead of using hardcoded values
- Removed unused HTTP client code from previous implementation
- Fixed network accessibility by removing hardcoded localhost references
- Updated ImageService to use dynamic server URL
- Changed server-info endpoint to return correct server port (3000)
- Made image directory path configurable instead of hardcoded
- Enhanced server-info endpoint to include current image directory
- Improved directory update validation with explicit directory type checking
- Enhanced error handling in directory update process with detailed error messages
- Added comprehensive logging throughout the directory update flow
- Improved gallery refresh mechanism to properly handle directory changes

### Fixed
- Directory update button now properly triggers gallery refresh
- Added proper error state handling for failed directory updates
- Fixed page reset behavior when changing directories

### Technical Details

#### Modified Files
1. `server/server.js`:
   - Added new endpoint `/api/server-info` to expose server IP and port
   - Uses Node.js `os` module to dynamically detect network IP
   - Fixed port number in server-info response to use actual server port
   - Added configurable image directory with validation
   - New endpoint `/api/update-directory` for changing image source
   - Made static file serving dynamic to support directory changes
   - Enhanced directory validation to verify path is a valid directory
   - Added detailed error reporting for directory access issues

2. `src/app/services/server-url.service.ts`:
   - Now fetches server info from backend API
   - Constructs URLs dynamically using window.location
   - Removed hardcoded localhost references
   - Added directory path management functionality
   - New methods for updating and tracking image directory

3. `src/app/services/image.service.ts`:
   - Removed hardcoded localhost URL
   - Updated to use dynamic server URL based on client location
   - Improved network accessibility
   - Added page reset functionality for directory changes
   - Enhanced refresh trigger mechanism with debug logging

4. `src/app/app.component.ts`:
   - Added directory path management
   - New UI controls for directory configuration
   - Error handling for invalid paths
   - Improved directory update response handling
   - Added detailed error feedback for failed updates

5. `src/app/app.component.html`:
   - Added directory configuration interface
   - New textfield for path input
   - Error message display
   - Enhanced error state visualization

6. `src/app/components/gallery/gallery.component.ts`:
   - Added comprehensive error handling for image loading
   - Improved refresh trigger handling
   - Enhanced page state management
   - Added debug logging for troubleshooting

6. `src/app/app.component.scss`:
   - Added styles for directory configuration UI
   - Enhanced header layout to accommodate new controls

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
  "port": 3000,
  "imageDirectory": "/path/to/images"
}
```

#### New API Endpoint
```json
POST /api/update-directory
Request:
{
  "directory": "/path/to/new/directory"
}

Response:
{
  "success": true,
  "imageDirectory": "/path/to/new/directory"
}
