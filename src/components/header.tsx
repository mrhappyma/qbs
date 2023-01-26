import Link from "next/link";

const Header: React.FC = () => {
  return (
    <div className="mb-6 border-b border-gray-200 bg-gray-100 pt-4">
      <div className="md:md-6 container mx-auto mb-4">
        <header className="ml-4 flex items-center justify-between px-2  md:px-0">
          <Link className="flex items-center" href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3 truncate text-lg font-semibold" role="banner">
              QuizBowl Score
            </div>
          </Link>
          <nav className="flex items-center">
            <Link
              href="/api/auth/signout"
              className="  hidden px-2 py-1 text-gray-600 hover:text-gray-800 sm:inline-block"
            >
              Logout
            </Link>
          </nav>
        </header>
        <nav className="navigation relative left-1 flex items-center overflow-auto md:container md:-left-3 md:mx-auto md:px-0">
          <Link
            className="group relative m-2 whitespace-nowrap pl-3 text-gray-600 hover:text-gray-800"
            href="/matches"
          >
            Matches
          </Link>
          <Link
            className="group relative m-2 whitespace-nowrap text-gray-600 hover:text-gray-800"
            href="/teams"
          >
            Teams
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
