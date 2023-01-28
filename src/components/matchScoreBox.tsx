import { matchScoreEventType } from "../utils/enums";

/**
 * Scrollable box with match score events
 */
const MatchScoreBox: React.FC<{ data: matchScore; team: number }> = (props) => {
  const stuff: JSX.Element[] = [];
  let totalScore: number = 0;
  for (const event of props.data.events) {
    if (
      event.type == matchScoreEventType.add &&
      event.team == props.team &&
      event.score > 0
    ) {
      stuff.push(<div className="text-xl text-green-600">+{event.score}</div>);
      totalScore += event.score;
    }
    if (
      event.type == matchScoreEventType.add &&
      event.team == props.team &&
      event.score < 0
    ) {
      stuff.push(<div className="text-xl text-red-600">{event.score}</div>);
      totalScore += event.score;
    }
  }

  return (
    <div className="h-full w-full overflow-scroll p-2">
      {stuff}
      <div className="text-2xl text-slate-800">{totalScore}</div>
    </div>
  );
};

export default MatchScoreBox;
