import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

class SheetsConnector:
    def __init__(self):
        self.SPREADSHEET_ID = os.getenv('SPREADSHEET_ID')
        self.SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
        self.credentials = Credentials.from_service_account_file(
            os.getenv('GOOGLE_CREDENTIALS_FILE'),
            scopes=self.SCOPES
        )
        self.service = build('sheets', 'v4', credentials=self.credentials)
        self.sheet = self.service.spreadsheets()
    
    def get_overall_standings(self):
        """Get overall standings from 'Overall' sheet"""
        result = self.sheet.values().get(
            spreadsheetId=self.SPREADSHEET_ID,
            range='Overall!A2:E'  # Assuming: Division, Gold, Silver, Bronze, Points
        ).execute()
        return result.get('values', [])
    
    def get_sports_standings(self):
        """Get sports standings from 'Sports' sheet"""
        result = self.sheet.values().get(
            spreadsheetId=self.SPREADSHEET_ID,
            range='Sports!A2:E'
        ).execute()
        return result.get('values', [])
    
    def get_cultural_standings(self):
        """Get cultural standings from 'Cultural' sheet"""
        result = self.sheet.values().get(
            spreadsheetId=self.SPREADSHEET_ID,
            range='Cultural!A2:E'
        ).execute()
        return result.get('values', [])
    
    def get_event_standings(self, event_id):
        """Get standings for a specific event"""
        sheet_name = event_id.replace('-', '_').title()
        result = self.sheet.values().get(
            spreadsheetId=self.SPREADSHEET_ID,
            range=f'{sheet_name}!A2:E'
        ).execute()
        return result.get('values', [])
    
    def get_event_fixtures(self, event_id):
        """Get fixtures for a specific event from Fixtures sheet"""
        result = self.sheet.values().get(
            spreadsheetId=self.SPREADSHEET_ID,
            range='Fixtures!A2:I'  # Event, Div1, Div2, Date, Time, Venue, Status, Winner, Score
        ).execute()
        
        rows = result.get('values', [])
        fixtures = []
        
        for idx, row in enumerate(rows):
            if len(row) > 0 and row[0] == event_id:
                fixtures.append({
                    'id': f'{event_id}-{idx}',
                    'eventId': row[0] if len(row) > 0 else '',
                    'division1': row[1] if len(row) > 1 else '',
                    'division2': row[2] if len(row) > 2 else '',
                    'date': row[3] if len(row) > 3 else '',
                    'time': row[4] if len(row) > 4 else '',
                    'venue': row[5] if len(row) > 5 else '',
                    'status': row[6] if len(row) > 6 else 'scheduled',
                    'winner': row[7] if len(row) > 7 else None,
                    'score': row[8] if len(row) > 8 else None,
                })
        
        return fixtures
    
    def update_event_score(self, event_id, division, gold, silver, bronze):
        """Update score for a specific event and division"""
        sheet_name = event_id.replace('-', '_').title()
        
        # Find the row for the division
        result = self.sheet.values().get(
            spreadsheetId=self.SPREADSHEET_ID,
            range=f'{sheet_name}!A2:A'
        ).execute()
        
        rows = result.get('values', [])
        row_index = None
        
        for idx, row in enumerate(rows):
            if len(row) > 0 and row[0] == division:
                row_index = idx + 2  # +2 because of header row and 0-indexing
                break
        
        if row_index is None:
            # Division not found, append new row
            self.sheet.values().append(
                spreadsheetId=self.SPREADSHEET_ID,
                range=f'{sheet_name}!A:E',
                valueInputOption='RAW',
                body={'values': [[division, gold, silver, bronze, 0]]}  # Points calculated separately
            ).execute()
        else:
            # Update existing row
            self.sheet.values().update(
                spreadsheetId=self.SPREADSHEET_ID,
                range=f'{sheet_name}!B{row_index}:D{row_index}',
                valueInputOption='RAW',
                body={'values': [[gold, silver, bronze]]}
            ).execute()
        
        return True
    
    def add_fixture(self, data):
        """Add a new fixture"""
        self.sheet.values().append(
            spreadsheetId=self.SPREADSHEET_ID,
            range='Fixtures!A:I',
            valueInputOption='RAW',
            body={'values': [[
                data['eventId'],
                data['division1'],
                data['division2'],
                data['date'],
                data['time'],
                data['venue'],
                'scheduled',
                '',
                ''
            ]]}
        ).execute()
        return data
    
    def update_fixture(self, data):
        """Update fixture status and results"""
        # Find the fixture row
        result = self.sheet.values().get(
            spreadsheetId=self.SPREADSHEET_ID,
            range='Fixtures!A2:A'
        ).execute()
        
        rows = result.get('values', [])
        # Implementation to find and update specific fixture
        # This is a simplified version - you'd need fixture ID logic
        
        return data
