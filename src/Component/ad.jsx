// AdminPanel.jsx
import React, { useState } from "react";
import {
  MdDashboard,
  MdBook,
  MdPeople,
  MdAssignment,
  MdEdit,
  MdKeyboardArrowDown,
  MdPerson,
  MdBarChart,
  MdFormatListBulleted,
  MdDescription,
  MdWarning,
  MdCheckCircle,
  MdRemoveCircle,
} from "react-icons/md";
import HajjForm from "./HajjForm";

// --- Navigation Items ---
const NAV_ITEMS = [
  {
    key: "form",
    label: "Forms",
    icon: <MdEdit />,
    children: [
      { key: "Form", label: " Form", icon: <MdPerson /> },
      { key: "clientForm", label: "Client Form", icon: <MdPeople /> },
    ],
  },
  {
    key: "report",
    label: "Reports",
    icon: <MdBarChart />,
    children: [
      {
        key: "portfolio",
        label: "Portfolio",
        icon: <MdDescription />,
        children: [
          { key: "generalportfolio", label: "General Portfolio", icon: <MdBarChart /> },
          { key: "staffportfolio", label: "Staff Portfolio", icon: <MdFormatListBulleted /> },
          { key: "groupReport", label: "Group Report", icon: <MdFormatListBulleted /> },
        ],
      },
    
      {
        key: "clientReports",
        label: "Client Reports",
        icon: <MdPeople />,
        children: [{ key: "clientSpecific", label: "Client Specific", icon: <MdPerson /> }],
      },
      {
        key: "systemReports",
        label: "System Reports",
        icon: <MdBarChart />,
        children: [
          { key: "transactionReports", label: "Transaction Logs", icon: <MdAssignment /> },
          { key: "auditLogs", label: "Audit Logs", icon: <MdBook /> },
        ],
      },
    ],
  },
];

// --- Helper to find active label ---
const findPath = (items, targetKey, currentPath = []) => {
  for (const item of items) {
    const newPath = [...currentPath, item.key];
    if (item.key === targetKey) return newPath;
    if (item.children) {
      const result = findPath(item.children, targetKey, newPath);
      if (result) return result;
    }
  }
  return null;
};

// --- Button Component ---
const Button = ({ variant = "default", onClick, className = "", children }) => {
  let baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-950 disabled:pointer-events-none disabled:opacity-50";
  let variantStyles = "";

  switch (variant) {
    case "default":
      variantStyles = "bg-indigo-600 text-white shadow hover:bg-indigo-700";
      break;
    case "ghost":
      variantStyles = "hover:bg-indigo-100 hover:text-indigo-700 text-gray-700";
      break;
    default:
      variantStyles = "bg-indigo-600 text-white shadow hover:bg-indigo-700";
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className} h-9 px-4 py-2`}
    >
      {children}
    </button>
  );
};

// --- Placeholder Components ---
const Dashboard = () => (
  <div className="p-6 bg-white rounded-xl shadow-md">
    <h2 className="text-2xl font-semibold text-gray-800">Welcome to the Admin Dashboard</h2>
    <p className="mt-2 text-gray-600">Select an item from the sidebar to get started.</p>
  </div>
);

const Placeholder = ({ title }) => (
  <div className="p-6 bg-white rounded-xl shadow-md">
    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    <p className="mt-2 text-gray-600">Content coming soon...</p>
  </div>
);

// --- Main Admin Panel ---
function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openNestedDropdowns, setOpenNestedDropdowns] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const toggleNestedDropdown = (key) => {
    setOpenNestedDropdowns((prev) => {
      const newState = { ...prev };
      if (newState[key]) {
        delete newState[key];
      } else {
        newState[key] = true;
      }
      return newState;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "Form": return <HajjForm />;

      default: return <Placeholder title={activeTab} />;
    }
  };

  const getHeaderLabel = () => {
    const findLabel = (items, currentKey) => {
      for (const item of items) {
        if (item.key === currentKey) return item.label;
        if (item.children) {
          const childLabel = findLabel(item.children, currentKey);
          if (childLabel) return childLabel;
        }
      }
      return null;
    };
    return findLabel(NAV_ITEMS, activeTab) || "Admin Panel Dashboard";
  };

  const renderNavItems = (items, level = 0) =>
    items.map((item) => (
      <div key={item.key} className={level > 0 ? `pl-${level * 4} pt-1` : ""}>
        {item.children ? (
          <>
            <Button
              variant={openNestedDropdowns[item.key] ? "default" : "ghost"}
              onClick={() => {
                if (level === 0) {
                  setOpenDropdown(openDropdown === item.key ? null : item.key);
                  setOpenNestedDropdowns((prev) => {
                    const newState = {};
                    if (prev[item.key]) return {};
                    else {
                      newState[item.key] = true;
                      return newState;
                    }
                  });
                } else {
                  toggleNestedDropdown(item.key);
                }
              }}
              className={`w-full justify-start flex items-center gap-2 py-2 ${
                level === 0 ? "text-base" : "text-sm"
              }`}
            >
              {item.icon} {item.label}
              <MdKeyboardArrowDown
                size={16}
                className={`ml-auto transition-transform ${
                  openNestedDropdowns[item.key] ? "rotate-180" : ""
                }`}
              />
            </Button>
            {openNestedDropdowns[item.key] && (
              <div className="space-y-1">{renderNavItems(item.children, level + 1)}</div>
            )}
          </>
        ) : (
          <Button
            variant={activeTab === item.key ? "default" : "ghost"}
            onClick={() => {
              setActiveTab(item.key);
              const path = findPath(NAV_ITEMS, item.key);
              const newOpenNestedDropdowns = {};
              if (path) {
                path.forEach((keyInPath) => {
                  newOpenNestedDropdowns[keyInPath] = true;
                });
              }
              setOpenNestedDropdowns(newOpenNestedDropdowns);
              if (path && path.length > 0) setOpenDropdown(path[0]);
              else setOpenDropdown(null);
            }}
            className={`w-full justify-start flex items-center gap-2 py-1 ${
              level === 0 ? "text-base" : "text-sm"
            }`}
          >
            {item.icon} {item.label}
          </Button>
        )}
      </div>
    ));

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 border-r border-gray-200 shadow-lg flex flex-col">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">Admin Panel</h2>
        <div className="space-y-2 flex-grow">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => {
              setActiveTab("dashboard");
              setOpenDropdown(null);
              setOpenNestedDropdowns({});
            }}
            className="w-full justify-start flex items-center gap-2 text-base py-2 mb-2"
          >
            <MdDashboard /> Dashboard
          </Button>
          {renderNavItems(NAV_ITEMS)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{getHeaderLabel()}</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel;
