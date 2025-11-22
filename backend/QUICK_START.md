# Quick Start Guide - Division Wars Python Backend

Follow these steps to get your backend running in under 10 minutes.

## Step 1: Get Google Sheets API Credentials (5 minutes)

1. Visit: https://console.cloud.google.com/
2. Create new project: "Division Wars"
3. Enable Google Sheets API:
   - Click "Enable APIs and Services"
   - Search "Google Sheets API"
   - Click "Enable"
4. Create Service Account:
   - Go to "Credentials" → "Create Credentials" → "Service Account"
   - Name it "division-wars-backend"
   - Click "Create and Continue"
   - Skip optional steps
   - Click "Done"
5. Download credentials:
   - Click on the service account email
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key" → "JSON"
   - Save as `credentials.json` in `backend/` folder
6. Share your Google Sheet:
   - Open: https://docs.google.com/spreadsheets/d/1DkeCAbV7DE9oytGfQ_cC2L7DNTuyrEe8DuIj6vK8prA/edit
   - Click "Share" button
   - Paste the service account email (from credentials.json)
   - Set permission to "Editor"
   - Click "Send"

## Step 2: Install Dependencies (1 minute)

```bash
cd backend
pip install -r requirements.txt
```

## Step 3: Configure Environment (30 seconds)

```bash
cp .env.example .env
```

The `.env` file already has the correct spreadsheet ID. No changes needed unless you want to change the port.

## Step 4: Generate Sport Modules (30 seconds)

```bash
python create_sport_modules.py
```

This creates all sport and cultural event Python files.

## Step 5: Structure Your Google Sheet

Your sheet needs these tabs with these exact column headers:

**Tab: "Overall"**
```
Division | Gold | Silver | Bronze | Points
```

**Tab: "Sports"**
```
Division | Gold | Silver | Bronze | Points
```

**Tab: "Cultural"**
```
Division | Gold | Silver | Bronze | Points
```

**Tab: "Fixtures"**
```
EventId | Div1 | Div2 | Date | Time | Venue | Status | Winner | Score
```

**Individual Event Tabs** (one for each event like "Chess", "Badminton", etc.)
```
Division | Gold | Silver | Bronze | Points
```

You can copy/paste this template: https://docs.google.com/spreadsheets/d/YOUR_TEMPLATE_HERE

## Step 6: Run the Backend (10 seconds)

```bash
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
```

## Step 7: Test It Works

Open your browser and visit:
- http://localhost:5000/api/standings

You should see JSON data (might be empty if sheet has no data yet).

## Step 8: Connect Frontend

The frontend is already configured! Just make sure:
1. Backend is running on port 5000
2. Frontend can see `http://localhost:5000`

Test by:
1. Open your Lovable app preview
2. Open browser console (F12)
3. Look for API calls in Network tab
4. You should see calls to localhost:5000

## Troubleshooting

**"Permission denied" error:**
- Did you share the sheet with the service account email?
- Check the email in credentials.json under "client_email"

**"Module not found" error:**
- Run: `pip install -r requirements.txt`

**"Address already in use" error:**
- Change PORT in `.env` to 5001
- Update `API_BASE_URL` in `src/lib/sheets.ts`

**No data showing:**
- Add data to your Google Sheet tabs
- Make sure column headers match exactly
- Divisions should be: A, B, C, D, E

## Next Steps

1. **Add data to your sheet** - Start with the Overall, Sports, Cultural tabs
2. **Customize points logic** - Edit `points_calculator.py`
3. **Add event rules** - Edit files in `sports/` and `cultural/` folders
4. **Test score updates** - Use the Admin panel in the frontend
5. **Deploy to production** - See DEPLOYMENT.md

## Files You'll Most Likely Edit

- `backend/points_calculator.py` - Points calculation logic
- `backend/sports/chess.py` - Chess-specific rules and validation
- `backend/sports/[other-sports].py` - Other sport files
- `backend/cultural/[events].py` - Cultural event files
- `backend/.env` - Configuration (PORT, etc.)

## Need Help?

Common issues and solutions in README.md and FRONTEND_INTEGRATION.md
