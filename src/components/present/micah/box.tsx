import { useEffect, useRef } from "react";
import { Orbitron } from "@next/font/google";
import { matchScoreEventType } from "../../../utils/enums";

const orbitron = Orbitron({ subsets: ["latin"] });

/**
 * Scrollable box with match score events
 */
const MatchScoreBox: React.FC<{
  data: matchScore;
  team: number;
  textColor: string;
  backgroundColor: string;
  teamName: string;
}> = (props) => {
  const scrollItems: JSX.Element[] = [];
  let totalScore = 0;
  let keys = 0;
  for (const event of props.data.events) {
    if (event.type == matchScoreEventType.add && event.team == props.team) {
      scrollItems.push(
        <div
          className="text-[6vh]"
          style={{ color: props.textColor }}
          key={keys++}
        >
          {event.score > 0 && "+"}
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
    <div
      className={`grid h-screen w-full grid-cols-3 p-2 ${orbitron.className}`}
      style={{ backgroundColor: props.backgroundColor }}
    >
      <div className="h-full w-full overflow-y-auto ">
        {scrollItems}
        <div ref={messagesEndRef} />
      </div>
      <div className="text-center" style={{ color: props.textColor }}>
        <div className="text-[5vh]">{props.teamName}</div>
        <div className="text-[11vh]">{totalScore}</div>
      </div>
    </div>
  );
};

export default MatchScoreBox;
