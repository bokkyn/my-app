import { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg md:hidden hover:bg-primary/90 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-muted text-foreground transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 z-40 shadow-sm border-r`}
      >
        <div className="p-4">
          {/* Close Button (Visible on Mobile Only) */}

          {/* Sidebar Content */}
          <div className="flex flex-row align-bottom justify-end justify-items-end">
            <h2 className="text-2xl mb-6 font-semibold text-foreground">
              Izbornik
            </h2>
          </div>
          <ul>
            <li className="mb-3">
              <Link
                to="/"
                className="block p-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-medium"
                onClick={closeSidebar}
              >
                Dnevna igra
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/vjezba"
                className="block p-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors font-medium"
                onClick={closeSidebar}
              >
                Vježba
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/o-projektu"
                className="block p-3 bg-accent text-accent-foreground hover:bg-accent/80 rounded-lg transition-colors font-medium"
                onClick={closeSidebar}
              >
                O Projektu
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
