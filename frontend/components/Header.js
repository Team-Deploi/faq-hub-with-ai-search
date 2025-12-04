import React from "react";
import { GitHubIcon } from "./icons/GitHubIcon";

const Header = () => {
  return (
    <header className="sticky z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 px-2 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <a className="flex items-center gap-2" href={"/"}>
            <span className="text-lg sm:text-2xl pl-2 font-semibold">
              Sanity + Next.js
            </span>
          </a>
          <nav>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
            >
              <li className="flex sm:gap-4 md:gap-6">
                <a
                  className="rounded-full flex gap-4 items-center bg-primary-100 hover:bg-blue focus:bg-blue py-2 px-4 justify-center sm:py-3 sm:px-6 text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/sanity-io/sanity-template-nextjs-clean"
                >
                  <span className="whitespace-nowrap">View on GitHub</span>
                  <GitHubIcon className="hidden sm:block h-4 sm:h-6" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
