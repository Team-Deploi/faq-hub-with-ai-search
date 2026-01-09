import React from "react";
import { HeartIcon } from "./icons/HeartIcon";

const Footer = () => {
  return (
    <footer className="bg-white py-6 mt-10 border-t border-gray-100">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-1">
          Built with{" "}
          <HeartIcon className="w-4 h-4 text-red-500 fill-current inline-block" />{" "}
          by{" "}
          <a
            href="https://deploi.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-100 hover:text-blue transition-colors font-medium"
          >
            Deploi
          </a>{" "}
          — experts in Sanity, headless, and custom web development.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
