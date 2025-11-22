# Frontend Integration Guide

## Connecting React Frontend to Python Backend

The React frontend is already configured to call the Python backend APIs. Here's what you need to know:

### 1. Update API Base URL

In `src/lib/sheets.ts`, update the `API_BASE_URL` constant:

```typescript
// For local development
const API_BASE_URL = "http://localhost:5000/api";

// For production (after deploying backend)
const API_BASE_URL = "https://your-backend-domain.com/api";
```

### 2. Enable CORS for Development

The Python backend already has CORS enabled via `flask-cors`. If you deploy to production, you may want to restrict CORS:

```python
# In app.py
from flask_cors import CORS

# Development (allow all origins)
CORS(app)

# Production (restrict to your frontend domain)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"]
    }
})
```

### 3. API Endpoints Used by Frontend

The frontend makes these API calls:

**Standings:**
- `GET /api/standings` - Overall standings (Dashboard)
- `GET /api/standings/sports` - Sports tab on Dashboard
- `GET /api/standings/cultural` - Cultural tab on Dashboard
- `GET /api/event/<event_id>/standings` - Event detail pages

**Fixtures:**
- `GET /api/event/<event_id>/fixtures` - Scheduled and completed matches

**Rules:**
- `GET /api/event/<event_id>/rules` - Event-specific rules (from Python modules)

**Score Updates:**
- `POST /api/score/update` - Admin panel score submission

### 4. Testing the Integration

1. **Start the Python backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Start the React frontend (in Lovable):**
   The Lovable preview should already be running

3. **Test the connection:**
   - Open browser console (F12)
   - Navigate to the Dashboard
   - Check for API calls in Network tab
   - Look for any CORS or connection errors

### 5. Handling Errors

The frontend has error handling built in. If the backend is not running, you'll see:
- Console errors showing failed fetch requests
- Empty standings tables (with 0s)
- Error toasts in the Admin panel when updating scores

### 6. Production Deployment

**Backend Deployment:**
1. Deploy Python backend to Heroku, DigitalOcean, AWS, etc.
2. Get the production URL (e.g., `https://api.divisionwars.com`)
3. Update `API_BASE_URL` in `src/lib/sheets.ts`
4. Ensure CORS is properly configured for your frontend domain

**Frontend Deployment:**
1. The frontend is deployed automatically through Lovable
2. Click "Publish" in Lovable to deploy frontend changes
3. Your site will be live at `yourdomain.lovable.app` or your custom domain

### 7. Environment-Specific Configuration

For different environments, you can use this pattern:

```typescript
// src/lib/sheets.ts
const API_BASE_URL = import.meta.env.PROD 
  ? "https://api.divisionwars.com/api"  // Production
  : "http://localhost:5000/api";         // Development
```

### 8. Troubleshooting

**"Failed to fetch" errors:**
- Ensure Python backend is running
- Check the backend URL is correct
- Verify CORS is enabled
- Check browser console for detailed errors

**Empty data on pages:**
- Backend might not be running
- Google Sheets might not have data yet
- Check backend logs: `python app.py` output

**CORS errors:**
- Ensure `flask-cors` is installed
- Check CORS configuration in `app.py`
- Try clearing browser cache

**Authentication issues:**
- The auth system is currently static (frontend only)
- No backend authentication required for API calls
- To add backend auth, implement token validation in Flask

### 9. Adding New Endpoints

If you need to add new API endpoints:

1. **Add to Python backend** (`app.py`):
```python
@app.route('/api/your-new-endpoint', methods=['GET'])
def your_function():
    # Your logic
    return jsonify(data)
```

2. **Add to React frontend** (`src/lib/sheets.ts`):
```typescript
export const fetchYourData = async () => {
  const response = await fetch(`${API_BASE_URL}/your-new-endpoint`);
  return await response.json();
};
```

3. **Use in components**:
```typescript
import { fetchYourData } from "@/lib/sheets";

// In component
const data = await fetchYourData();
```
