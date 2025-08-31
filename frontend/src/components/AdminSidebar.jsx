import React from "react";

function AdminSidebar({
  isExpanded,
  onMouseEnter,
  onMouseLeave,
  activeNavItem,
  onNavClick,
}) {
  const navItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      text: "Dashboard",
      id: "admin_home",
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 3a1 1 0 000 2h1v2H7a4 4 0 00-4 4v6a4 4 0 004 4h10a4 4 0 004-4V11a4 4 0 00-4-4h-2V5h1a1 1 0 100-2H8zm3 2h2v2h-2V5z" />
        </svg>
      ),
      text: "Events",
      id: "admin_events",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      text: "Request",
      id: "admin_request",
    },
  ];

  return (
    <nav
      className={`fixed left-0 top-0 h-full bg-gradient-to-br from-orange-50 to-yellow-50 shadow-2xl transition-all duration-500 ease-in-out z-50 overflow-hidden border-r border-orange-200/30 ${
        isExpanded ? "w-70" : "w-20"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="h-32 text-center border-b border-orange-200/30 flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100/50 to-yellow-100/50">
        <div
          className={`flex items-center transition-all duration-500 ease-in-out ${
            isExpanded
              ? "w-full justify-start px-2 gap-1"
              : "w-full justify-center"
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-full h-full"
            >
              <path
                fill="currentColor"
                d="M15.65 38.06 23 35.3V9.44L9 14.69v39.87l14-5.25V37.45l-6.65 2.49A1 1 0 0 1 16 40a1 1 0 0 1-.35-1.94zM15 36v-5a.88.88 0 0 1 0-.17 3 3 0 1 1 2 0 .88.88 0 0 1 0 .17v5a1 1 0 0 1-2 0zM41 14.69v25.86l6.65-2.49a1 1 0 0 1 .7 1.88L41 42.7v11.86l14-5.25V9.44zm7 21.45s-5-2.27-5-7.21a5 5 0 0 1 10 0c0 4.94-5 7.21-5 7.21zM39 42.7v11.86l-14-5.25V37.45l14 5.25zM39 14.69v25.86L25 35.3V9.44l14 5.25z"
              />
              <path
                fill="currentColor"
                d="M50 29a2 2 0 1 1-2-2 2 2 0 0 1 2 2z"
              />
              <path
                fill="currentColor"
                d="M48 27a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"
              />
            </svg>
          </div>
          <div
            className={`${
              isExpanded ? "ml-2" : "ml-0"
            } text-left transition-all duration-500 ease-in-out ${
              isExpanded ? "opacity-100 max-w-48" : "opacity-0 max-w-0"
            }`}
          >
            <div className="text-2xl font-bold font-inknut whitespace-nowrap">
              <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                ADMIN
              </span>
            </div>
            <div className="text-orange-400 text-xs uppercase tracking-wider whitespace-nowrap">
              Dashboard
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col h-full"
        style={{ height: "calc(100% - 8rem)" }}
      >
        <ul className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <li
              key={item.id}
              className={`${
                isExpanded ? "w-full" : "w-full flex justify-center"
              }`}
            >
              <button
                onClick={() => onNavClick(item.id)}
                className={`${
                  isExpanded
                    ? "w-full p-4 justify-start"
                    : "h-12 w-12 justify-center p-0"
                } rounded-2xl flex items-center transition-colors duration-200 ease-out hover:bg-orange-200/50 ${
                  activeNavItem === item.id
                    ? "bg-gradient-to-r from-red-400 to-yellow-400 text-white shadow-lg"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </span>
                <span
                  className={`${
                    isExpanded
                      ? "ml-4 inline-block font-medium text-left whitespace-nowrap"
                      : "hidden"
                  }`}
                >
                  {item.text}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div
          className={`border-t border-orange-200/30 bg-gradient-to-br from-orange-100/30 to-yellow-100/30 p-4 transition-all duration-500 ease-in-out ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-center">
            <div className="text-gray-600 text-xs mb-2">© 2025 CAMPUS-NAV</div>
            <div className="text-gray-500 text-xs">Admin Panel</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminSidebar;
