import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DIVISIONS } from "@/types/tournament";

interface TableColumn {
  key: string;
  label: string;
  type: string;
}

interface StandingRow {
  division: string;
  [key: string]: any;
}

interface EventStandingsTableProps {
  standings: StandingRow[];
  tableStructure?: TableColumn[];
}

const EventStandingsTable = ({ standings, tableStructure }: EventStandingsTableProps) => {
  // Default structure if not provided
  const defaultStructure: TableColumn[] = [
    { key: 'division', label: 'Division', type: 'text' },
    { key: 'played', label: 'Played', type: 'number' },
    { key: 'won', label: 'Won', type: 'number' },
    { key: 'lost', label: 'Lost', type: 'number' },
    { key: 'match_points', label: 'Match Points', type: 'number' },
    { key: 'game_points', label: 'Game Points', type: 'number' }
  ];

  const columns = tableStructure || defaultStructure;

  // Sort standings by match_points then game_points
  const sortedStandings = [...standings].sort((a, b) => {
    const pointsA = a.match_points || 0;
    const pointsB = b.match_points || 0;
    if (pointsB !== pointsA) return pointsB - pointsA;
    
    const gamePointsA = a.game_points || 0;
    const gamePointsB = b.game_points || 0;
    return gamePointsB - gamePointsA;
  });

  if (standings.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No matches recorded yet. Add match results to see standings.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16 text-center">Rank</TableHead>
            {columns.map((col) => (
              <TableHead 
                key={col.key} 
                className={col.type === 'number' ? 'text-center' : ''}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStandings.map((standing, index) => (
            <TableRow key={standing.division} className="hover:bg-muted/30 transition-colors">
              <TableCell className="text-center font-bold text-lg">
                {index + 1}
              </TableCell>
              {columns.map((col) => {
                if (col.key === 'division') {
                  return (
                    <TableCell key={col.key} className="font-semibold">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: DIVISIONS[standing.division]?.color || '#999' }}
                        />
                        <span>
                          Division {standing.division} - {DIVISIONS[standing.division]?.name || 'Unknown'}
                        </span>
                      </div>
                    </TableCell>
                  );
                }
                
                return (
                  <TableCell 
                    key={col.key} 
                    className={`${col.type === 'number' ? 'text-center font-semibold' : ''}`}
                  >
                    {standing[col.key] !== undefined ? standing[col.key] : '-'}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventStandingsTable;
