from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from sheets_connector import SheetsConnector
from sports import chess, badminton, basketball, table_tennis, carrom, pool, throwball, foosball, volleyball, esports_fifa, esports_valo, box_cricket, football, pickleball, squash, lawn_tennis
from cultural import group_skit, group_dance, group_musical, roast_comedy, quiz, rotating_art, meme_wars, beg_borrow_steal
from points_calculator import calculate_standings

load_dotenv()

app = Flask(__name__)
CORS(app)

sheets = SheetsConnector()

# Sports event modules mapping
SPORTS_MODULES = {
    'chess': chess,
    'badminton': badminton,
    'basketball': basketball,
    'table-tennis': table_tennis,
    'carrom': carrom,
    'pool': pool,
    'throwball': throwball,
    'foosball': foosball,
    'volleyball': volleyball,
    'esports-fifa': esports_fifa,
    'esports-valo': esports_valo,
    'box-cricket': box_cricket,
    'football': football,
    'pickleball': pickleball,
    'squash': squash,
    'lawn-tennis': lawn_tennis,
}

# Cultural event modules mapping
CULTURAL_MODULES = {
    'group-skit': group_skit,
    'group-dance': group_dance,
    'group-musical': group_musical,
    'roast-comedy': roast_comedy,
    'quiz': quiz,
    'rotating-art': rotating_art,
    'meme-wars': meme_wars,
    'beg-borrow-steal': beg_borrow_steal,
}

@app.route('/api/standings', methods=['GET'])
def get_standings():
    """Get overall standings"""
    try:
        raw_data = sheets.get_overall_standings()
        standings = calculate_standings(raw_data)
        return jsonify(standings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/standings/sports', methods=['GET'])
def get_sports_standings():
    """Get sports-only standings"""
    try:
        raw_data = sheets.get_sports_standings()
        standings = calculate_standings(raw_data)
        return jsonify(standings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/standings/cultural', methods=['GET'])
def get_cultural_standings():
    """Get cultural-only standings"""
    try:
        raw_data = sheets.get_cultural_standings()
        standings = calculate_standings(raw_data)
        return jsonify(standings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/<event_id>/standings', methods=['GET'])
def get_event_standings(event_id):
    """Get standings for a specific event"""
    try:
        # Get match data
        matches = sheets.get_event_matches(event_id)
        
        # Get calculation logic from sport/cultural module
        module = SPORTS_MODULES.get(event_id) or CULTURAL_MODULES.get(event_id)
        
        if not module:
            return jsonify({'error': 'Event not found'}), 404
        
        # Calculate standings from matches
        divisions_data = {}
        for match in matches:
            team = match['team']
            if team not in divisions_data:
                divisions_data[team] = {'matches': []}
            divisions_data[team]['matches'].append(match)
        
        standings = []
        for division, data in divisions_data.items():
            stats = module.calculate_division_points(data)
            standings.append({
                'division': division,
                **stats
            })
        
        # Get table structure
        table_structure = module.get_table_structure() if hasattr(module, 'get_table_structure') else None
        
        return jsonify({
            'standings': standings,
            'table_structure': table_structure
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/<event_id>/matches', methods=['GET'])
def get_event_matches(event_id):
    """Get all matches for a specific event"""
    try:
        matches = sheets.get_event_matches(event_id)
        return jsonify({'matches': matches})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/<event_id>/fixtures', methods=['GET'])
def get_event_fixtures(event_id):
    """Get fixtures for a specific event"""
    try:
        fixtures = sheets.get_event_fixtures(event_id)
        return jsonify(fixtures)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/<event_id>/rules', methods=['GET'])
def get_event_rules(event_id):
    """Get rules for a specific event"""
    try:
        # Get rules from sport/cultural module
        module = SPORTS_MODULES.get(event_id) or CULTURAL_MODULES.get(event_id)
        if not module:
            return jsonify({'error': 'Event not found'}), 404
        
        rules = module.get_rules()
        return jsonify({'rules': rules})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/event/<event_id>/form-structure', methods=['GET'])
def get_form_structure(event_id):
    """Get the form structure for a specific event"""
    try:
        module = SPORTS_MODULES.get(event_id) or CULTURAL_MODULES.get(event_id)
        if not module:
            return jsonify({'error': 'Event not found'}), 404
        
        # Check if module has custom form structure
        if hasattr(module, 'get_form_structure'):
            form_structure = module.get_form_structure()
        else:
            # Default form structure
            form_structure = {
                'type': 'match',
                'fields': [
                    {'name': 'team1', 'label': 'Team 1', 'type': 'select', 'required': True},
                    {'name': 'team2', 'label': 'Team 2', 'type': 'select', 'required': True},
                    {'name': 'result', 'label': 'Result', 'type': 'select', 'options': ['win', 'loss', 'draw'], 'required': True},
                    {'name': 'match_points', 'label': 'Match Points', 'type': 'number'},
                    {'name': 'game_points', 'label': 'Game Points', 'type': 'number'}
                ]
            }
        
        return jsonify(form_structure)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/match/add', methods=['POST'])
def add_match():
    """Add a new match result"""
    try:
        data = request.json
        event_id = data.get('eventId')
        
        # Validate with sport/cultural specific logic
        module = SPORTS_MODULES.get(event_id) or CULTURAL_MODULES.get(event_id)
        if module and hasattr(module, 'validate_match'):
            is_valid, error = module.validate_match(data)
            if not is_valid:
                return jsonify({'error': error}), 400
        
        # Add match to sheets
        result = sheets.add_match(data)
        
        return jsonify({'success': True, 'match': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/score/update', methods=['POST'])
def update_score():
    """Update score for an event"""
    try:
        data = request.json
        event_id = data.get('eventId')
        division = data.get('division')
        gold = data.get('gold', 0)
        silver = data.get('silver', 0)
        bronze = data.get('bronze', 0)
        
        # Validate with sport/cultural specific logic
        module = SPORTS_MODULES.get(event_id) or CULTURAL_MODULES.get(event_id)
        if module:
            is_valid, error = module.validate_score(division, gold, silver, bronze)
            if not is_valid:
                return jsonify({'error': error}), 400
        
        # Update in sheets
        sheets.update_event_score(event_id, division, gold, silver, bronze)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fixture/add', methods=['POST'])
def add_fixture():
    """Add a new fixture"""
    try:
        data = request.json
        result = sheets.add_fixture(data)
        return jsonify({'success': True, 'fixture': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fixture/update', methods=['POST'])
def update_fixture():
    """Update fixture status and results"""
    try:
        data = request.json
        result = sheets.update_fixture(data)
        return jsonify({'success': True, 'fixture': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
