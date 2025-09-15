import { Link } from "react-router";

export default function FinalStandings() {
  return (
    <div className="final-standings">
      <div className="final-standings__header">
        <div className="final-standings__header-first">Blooket</div>
        <div className="final-standings__header-second">Final Standings</div>
        <Link to={{
          pathname: '/',
        }} className="final-standings__header-third">View Report</Link>
      </div>
    </div>
  )
}