# Division Wars - Python Backend

This is the Python backend for the Division Wars tournament application. It connects to Google Sheets for data storage and implements sport-specific logic.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "Credentials" → "Create Credentials" → "Service Account"
   - Download the JSON key file
   - Rename it to `credentials.json` and place it in the `backend/` folder
5. Share your Google Sheet with the service account email (found in credentials.json)
   - Open your sheet: https://docs.google.com/spreadsheets/d/1DkeCAbV7DE9oytGfQ_cC2L7DNTuyrEe8DuIj6vK8prA/edit
   - Click "Share"
   - Add the service account email with "Editor" permissions

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update if needed:
- `SPREADSHEET_ID` is already set
- `GOOGLE_CREDENTIALS_FILE` should point to your credentials file
- `PORT` can be changed if 5000 is in use

### 4. Prepare Google Sheets Structure

Your sheet should have these tabs:
- **Overall**: Columns: Division | Gold | Silver | Bronze | Points
- **Sports**: Same structure as Overall
- **Cultural**: Same structure as Overall
- **Fixtures**: Columns: EventId | Div1 | Div2 | Date | Time | Venue | Status | Winner | Score
- **Individual event sheets**: One per event (e.g., "Chess", "Badminton", etc.) with same structure as Overall

### 5. Generate Sport Module Files

```bash
python create_sport_modules.py
```

This creates all sport and cultural event Python files in `sports/` and `cultural/` directories.

### 6. Run the Backend Server

```bash
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Standings
- `GET /api/standings` - Get overall standings
- `GET /api/standings/sports` - Get sports-only standings
- `GET /api/standings/cultural` - Get cultural-only standings
- `GET /api/event/<event_id>/standings` - Get event-specific standings

### Fixtures
- `GET /api/event/<event_id>/fixtures` - Get fixtures for an event
- `POST /api/fixture/add` - Add a new fixture
- `POST /api/fixture/update` - Update fixture results

### Rules
- `GET /api/event/<event_id>/rules` - Get rules for an event

### Scores
- `POST /api/score/update` - Update scores
  ```json
  {
    "eventId": "chess",
    "division": "A",
    "gold": 1,
    "silver": 0,
    "bronze": 0
  }
  ```

## Customizing Sport Logic

Each sport has its own module in `sports/` or `cultural/` directories:

```python
# sports/chess.py

def validate_score(division, gold, silver, bronze):
    """Add custom validation rules"""
    # Your logic here
    return True, None

def get_rules():
    """Return formatted rules text"""
    return "# Chess Rules\n..."

def calculate_division_points(performance_data):
    """Custom point calculation"""
    # Your logic here
    return points
```

Update these functions for each sport according to tournament rules.

## Points Logic

Edit `points_calculator.py` to customize how points are calculated from medals:

```python
def calculate_standings(raw_data):
    # Update this logic
    points = (gold * 3) + (silver * 2) + (bronze * 1)
    return points
```

## Deployment

### Option 1: Heroku
```bash
# Add Procfile
echo "web: python app.py" > Procfile

# Deploy
heroku create division-wars-backend
git push heroku main
```

### Option 2: DigitalOcean / AWS / Azure
- Use Python 3.9+ runtime
- Set environment variables
- Upload credentials.json securely
- Run `python app.py`

### Option 3: Local Network
- Run on a local machine
- Update frontend API URL to your local IP
- Ensure firewall allows port 5000

## Frontend Integration

Update the frontend to point to your backend URL. See `FRONTEND_INTEGRATION.md` for details.

## Troubleshooting

**"Permission denied" on Google Sheets**
- Ensure the service account email has edit access to your sheet

**"Module not found"**
- Run `pip install -r requirements.txt`
- Run `python create_sport_modules.py`

**"Port already in use"**
- Change PORT in `.env` file
- Update frontend API calls accordingly

## File Structure

```
backend/
├── app.py                      # Main Flask application
├── sheets_connector.py         # Google Sheets integration
├── points_calculator.py        # Points calculation logic
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (create this)
├── credentials.json            # Google API credentials (create this)
├── sports/                     # Sport-specific modules
│   ├── chess.py
│   ├── badminton.py
│   └── ...
├── cultural/                   # Cultural event modules
│   ├── group_skit.py
│   └── ...
└── create_sport_modules.py    # Script to generate module files
```
