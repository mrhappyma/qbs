import { useEffect, useRef } from "react";
import { Orbitron } from "@next/font/google";

const orbitron = Orbitron({ subsets: ["latin"] });

/**
 * Shows total score for a team
 */
const MinimalScoreBox: React.FC<{
  data: matchScore;
  team: number;
}> = (props) => {
  let totalScore = 0;
  for (const event of props.data.events) {
    if (event.team == props.team) totalScore += event.score;
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
      className={`h-full max-h-full w-full max-w-full overflow-scroll p-2 ${orbitron.className}`}
    >
      <div className="text-[10vh] text-slate-800 dark:text-[#f8f8f2]">
        {totalScore}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MinimalScoreBox;
