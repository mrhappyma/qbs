import { useEffect, useRef } from "react";
import { matchScoreEventType } from "../utils/enums";

/**
 * Scrollable box with match score events
 */
const MatchScoreBox: React.FC<{
  data: matchScore;
  team: number;
}> = (props) => {
  const stuff: JSX.Element[] = [];
  let totalScore = 0;
  let keys = 0;
  for (const event of props.data.events) {
    if (
      event.type == matchScoreEventType.add &&
      event.team == props.team &&
      event.score > 0
    ) {
      stuff.push(
        <div className="text-xl text-green-600" key={keys++}>
          +{event.score}
        </div>
      );
      totalScore += event.score;
    }
    if (
      event.type == matchScoreEventType.add &&
      event.team == props.team &&
      event.score < 0
    ) {
      stuff.push(
        <div className="text-xl text-red-600" key={keys++}>
          {event.score}
        </div>
      );
      totalScore += event.score;
    }
  }

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // take that, typechecking errors i don't know how to deal with
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div className={`h-full max-h-full w-full max-w-full overflow-scroll p-2 `}>
      {stuff}
      <div className="text-2xl text-slate-800">{totalScore}</div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MatchScoreBox;
