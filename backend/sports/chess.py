"""
Chess Event Logic - Swiss System Tournament
"""

def validate_match(match_data):
    """
    Validate Chess match data before updating
    
    Args:
        match_data: Dictionary with team1, team2, result, match_points, game_points
    
    Returns:
        (is_valid, error_message)
    """
    required_fields = ['team1', 'team2', 'result']
    for field in required_fields:
        if field not in match_data or not match_data[field]:
            return False, f"Missing required field: {field}"
    
    valid_results = ['win', 'loss', 'draw']
    if match_data['result'] not in valid_results:
        return False, f"Invalid result. Must be one of: {valid_results}"
    
    return True, None


def calculate_match_points(result):
    """Calculate match points based on result"""
    points_map = {
        'win': 2,
        'draw': 1,
        'loss': 0
    }
    return points_map.get(result, 0)


def validate_score(division, gold, silver, bronze):
    """Legacy validation - kept for compatibility"""
    if gold < 0 or silver < 0 or bronze < 0:
        return False, "Medal counts cannot be negative"
    return True, None


def get_rules():
    """
    Get Chess event rules
    
    Returns:
        String containing formatted rules
    """
    # TODO: Add actual Chess tournament rules
    return """
# Chess Tournament Rules

## Format
To be announced

## Scoring
To be announced

## Rules
1. Rule 1
2. Rule 2
3. Rule 3

## Placeholder
This section will be updated with complete rules.
"""


def calculate_division_points(performance_data):
    """
    Calculate points for a division in Chess based on match results
    
    Args:
        performance_data: Dictionary with 'matches' list containing match results
    
    Returns:
        Dictionary with played, won, lost, match_points, game_points
    """
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
            stats['game_points'] += match.get('game_points', 0)
    
    return stats


def get_table_structure():
    """
    Define the standings table structure for Chess
    
    Returns:
        List of column definitions
    """
    return [
        {'key': 'division', 'label': 'Division', 'type': 'text'},
        {'key': 'played', 'label': 'Played', 'type': 'number'},
        {'key': 'won', 'label': 'Won', 'type': 'number'},
        {'key': 'lost', 'label': 'Lost', 'type': 'number'},
        {'key': 'drawn', 'label': 'Drawn', 'type': 'number'},
        {'key': 'match_points', 'label': 'Match Points', 'type': 'number'},
        {'key': 'game_points', 'label': 'Game Points', 'type': 'number'}
    ]


def get_player_requirements():
    """
    Define the player structure/requirements for Chess.
    
    Returns:
        Dictionary defining player requirements
    """
    # TODO: Define player details structure
    return {
        "min_players": 0,
        "max_players": 0,
        "roles": [], # e.g. ["Captain", "Goalkeeper"]
        "gender_requirements": {} # e.g. {"male": 0, "female": 0}
    }
