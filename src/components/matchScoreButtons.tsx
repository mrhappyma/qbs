import type { Dispatch, SetStateAction } from "react";

const MatchScoreButtons: React.FC<{
  team: number;
  actionDataState: Dispatch<
    SetStateAction<{
      team: number;
      amount: number;
    }>
  >;
  requestEnableState: Dispatch<SetStateAction<boolean>>;
  undoDataState: Dispatch<SetStateAction<{ team: number }>>;
  undoEnableState: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
  return (
    <div className="flex flex-row justify-between gap-2 p-1">
      <button
        onClick={() => {
          props.undoDataState({ team: props.team });
          props.undoEnableState(true);
        }}
        type="button"
        className="inline-block rounded border-2 border-yellow-500 px-6 py-2 text-xs font-medium uppercase leading-tight text-yellow-500 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
      >
        ↺
      </button>
      <button
        onClick={() => {
          props.actionDataState({ team: props.team, amount: +5 });
          props.requestEnableState(true);
        }}
        type="button"
        className="inline-block rounded border-2 border-green-500 px-6 py-2 text-xs font-medium uppercase leading-tight text-green-500 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
      >
        +5
      </button>
      <button
        onClick={() => {
          props.actionDataState({ team: props.team, amount: +10 });
          props.requestEnableState(true);
        }}
        type="button"
        className="inline-block rounded border-2 border-green-500 px-6 py-2 text-xs font-medium uppercase leading-tight text-green-500 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
      >
        +10
      </button>
      <button
        onClick={() => {
          props.actionDataState({ team: props.team, amount: +15 });
          props.requestEnableState(true);
        }}
        type="button"
        className="inline-block rounded border-2 border-green-500 px-6 py-2 text-xs font-medium uppercase leading-tight text-green-500 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
      >
        +15
      </button>
      <button
        onClick={() => {
          props.actionDataState({ team: props.team, amount: -5 });
          props.requestEnableState(true);
        }}
        type="button"
        className="inline-block rounded border-2 border-red-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-red-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
      >
        -5
      </button>
    </div>
  );
};

export default MatchScoreButtons;
