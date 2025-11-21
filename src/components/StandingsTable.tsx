import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DIVISIONS, type Standings } from "@/types/tournament";
import { Trophy, Medal, Award } from "lucide-react";

interface StandingsTableProps {
  standings: Standings[];
  showType?: boolean;
}

const StandingsTable = ({ standings, showType = false }: StandingsTableProps) => {
  const sortedStandings = [...standings].sort((a, b) => {
    // TODO: Update points calculation logic here
    // Placeholder: Sort by gold, then silver, then bronze
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    return b.bronze - a.bronze;
  });

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Division</TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-gold" />
                Gold
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Medal className="w-4 h-4 text-silver" />
                Silver
              </div>
            </TableHead>
            <TableHead className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-bronze" />
                Bronze
              </div>
            </TableHead>
            <TableHead className="text-center font-bold">Total Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStandings.map((standing, index) => (
            <TableRow key={standing.division} className="hover:bg-muted/30 transition-colors">
              <TableCell className="text-center font-bold text-lg">
                {index + 1}
              </TableCell>
              <TableCell className="font-semibold">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: DIVISIONS[standing.division].color }}
                  />
                  <span className="text-lg">
                    Division {standing.division} - {DIVISIONS[standing.division].name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center font-semibold text-gold">
                {standing.gold}
              </TableCell>
              <TableCell className="text-center font-semibold text-silver">
                {standing.silver}
              </TableCell>
              <TableCell className="text-center font-semibold text-bronze">
                {standing.bronze}
              </TableCell>
              <TableCell className="text-center font-bold text-xl text-primary">
                {standing.points || "TBD"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StandingsTable;
