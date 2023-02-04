import { useRouter } from "next/router";
import { api } from "../utils/api";

const CreateMatchButton: React.FC = () => {
  const router = useRouter();
  const teamCreateRequest = api.match.create.useQuery(undefined, {
    enabled: false,
  });

  const createMatch = async () => {
    const team = await teamCreateRequest.refetch();

    if (!team.data) {
      console.error("no request data");
      return;
    }
    if (team.data.data.status != "ok") {
      console.error("request error! oh jeez...");
      return;
    }

    return router.push("/match/" + team.data.data.id);
  };

  return (
    <div className="ml-4 hidden self-start md:block">
      <button
        className="rounded-lg border border-gray-400 bg-gray-300 p-3 px-3 dark:bg-[#282a36] dark:hover:bg-[#44475a]"
        onClick={void createMatch}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
        </svg>
      </button>
    </div>
  );
};

export default CreateMatchButton;
