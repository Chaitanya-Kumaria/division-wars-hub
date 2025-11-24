# Match-by-Match Scoring System

## Overview
The system now supports match-by-match result tracking for all events. Each match is recorded individually, and standings are calculated automatically based on accumulated results.

## Google Sheets Structure

### Matches Sheet
Create a new sheet named "Matches" with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| A - Event | Event ID | chess, badminton, etc. |
| B - Team | Division playing | A, B, C, D, E |
| C - Opponent | Opposing division | A, B, C, D, E |
| D - Result | Match outcome | win, loss, draw |
| E - Match Points | Points for match result | 2, 1, 0 |
| F - Game Points | Points for games won | 1, 0.5, 0 |
| G - Date | Match date | 2024-01-15 |
| H - Round | Round number | 1, 2, 3, etc. |

**Note:** When a match is added, TWO rows are created automatically (one for each team with opposite results).

## Sport-Specific Implementation

### Chess Example
File: `backend/sports/chess.py`

**Table Structure:**
- Played: Total matches
- Won: Matches won
- Lost: Matches lost
- Drawn: Matches drawn
- Match Points: 2 per win, 1 per draw, 0 per loss
- Game Points: Individual game victories

**Scoring:**
```python
def calculate_division_points(performance_data):
    matches = performance_data.get('matches', [])
    stats = {
        'played': len(matches),
        'won': 0,
        'lost': 0,
        'drawn': 0,
        'match_points': 0,
        'game_points': 0
    }
    
    for match in matches:
        result = match.get('result', '').lower()
        if result == 'win':
            stats['won'] += 1
            stats['match_points'] += 2
            stats['game_points'] += match.get('game_points', 1)
        elif result == 'draw':
            stats['drawn'] += 1
            stats['match_points'] += 1
            stats['game_points'] += match.get('game_points', 0.5)
        elif result == 'loss':
            stats['lost'] += 1
    
    return stats
```

## Admin Panel Usage

### Recording Match Results

1. **Navigate to Admin Panel** (`/admin`)
2. **Select Event** from the dropdown
3. **Enter Match Details:**
   - Team 1 (Division)
   - Team 2 (Division)
   - Result (from Team 1's perspective)
   - Match Points (optional, auto-calculated)
   - Game Points (optional, auto-calculated)
4. **Submit** - Both teams' records are updated automatically

### Viewing Standings

1. Navigate to the event detail page
2. View the standings table with sport-specific columns
3. Standings update automatically as matches are added

## API Endpoints

### Add Match Result
```
POST /api/match/add
{
  "eventId": "chess",
  "team1": "A",
  "team2": "B",
  "result": "win",  // from team1's perspective
  "match_points": 2,
  "game_points": 1,
  "date": "2024-01-15",
  "round": 1
}
```

### Get Event Matches
```
GET /api/event/chess/matches
```

### Get Event Standings
```
GET /api/event/chess/standings

Response:
{
  "standings": [
    {
      "division": "A",
      "played": 5,
      "won": 4,
      "lost": 0,
      "drawn": 1,
      "match_points": 9,
      "game_points": 4.5
    }
  ],
  "table_structure": [
    {"key": "division", "label": "Division", "type": "text"},
    {"key": "played", "label": "Played", "type": "number"},
    ...
  ]
}
```

## Customizing for Other Sports

To add match-by-match tracking for other sports:

1. **Update sport module** (e.g., `backend/sports/badminton.py`):
   ```python
   def validate_match(match_data):
       # Add sport-specific validation
       return True, None
   
   def calculate_division_points(performance_data):
       # Calculate stats from matches
       return {
           'played': 0,
           'won': 0,
           # ... sport-specific stats
       }
   
   def get_table_structure():
       # Define table columns
       return [
           {'key': 'division', 'label': 'Division', 'type': 'text'},
           {'key': 'played', 'label': 'Played', 'type': 'number'},
           # ... sport-specific columns
       ]
   ```

2. **Test in Admin Panel** - The form automatically adapts to the sport

## Migration from Medal-Based System

The legacy medal-based scoring system still works via:
```
POST /api/score/update
{
  "eventId": "chess",
  "division": "A",
  "gold": 1,
  "silver": 0,
  "bronze": 0
}
```

However, we recommend using the new match-by-match system for:
- Better transparency
- Detailed tracking
- Automatic standings calculation
- Support for ties and draws
- Round-by-round progression

## Best Practices

1. **Record matches immediately** after completion
2. **Use consistent date formats** (YYYY-MM-DD)
3. **Track round numbers** for tournament progression
4. **Review standings** after each round to verify accuracy
5. **Backup your Matches sheet** regularly
