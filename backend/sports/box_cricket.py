"""
Box Cricket Event Logic
"""

def validate_score(division, gold, silver, bronze):
    """
    Validate Box Cricket scores before updating
    
    Args:
        division: Division name (A, B, C, D, E)
        gold, silver, bronze: Medal counts
    
    Returns:
        (is_valid, error_message)
    """
    # TODO: Add Box Cricket-specific validation rules
    
    if gold < 0 or silver < 0 or bronze < 0:
        return False, "Medal counts cannot be negative"
    
    return True, None


def get_rules():
    """
    Get Box Cricket event rules
    
    Returns:
        String containing formatted rules
    """
    # TODO: Add actual Box Cricket tournament rules
    return """
# Box Cricket Tournament Rules

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
    Calculate points for a division in Box Cricket
    
    Args:
        performance_data: Dictionary containing performance metrics
                          (e.g., {'gold': 1, 'silver': 0, 'matches_won': 5})
    
    Returns:
        Total points for the division
    """
    # TODO: Implement Box Cricket-specific point calculation logic here
    # This is where you define how points are awarded for this specific sport
    
    points = 0
    # Example logic:
    # points += performance_data.get('gold', 0) * 5
    # points += performance_data.get('matches_won', 0) * 2
    
    return points


def get_player_requirements():
    """
    Define the player structure/requirements for Box Cricket.
    
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
