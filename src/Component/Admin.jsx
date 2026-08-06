import React, { useState } from "react";
import {
  MdDashboard,
  MdEdit,
  MdKeyboardArrowDown,
  MdPerson,
  MdBarChart,
  MdMenu,
  MdClose,
} from "react-icons/md";
import HajjForm from "./HajjForm/HajjForm";
import HajjReport from "./Report/HajjReport";
import HajjDashboard from "./DashBoard/HajjDashboard";
import DataAudit from "./Report/DataAudit";
import SCodeReport from "./Report/SCodeReport";
import PCodeReport from "./Report/PCodeReport";
import GeneralSeriesReport from "./Report/GeneralSeriesReport";
import DistrictFullReport from "./Report/DistrictFullReport";
import Tag from "./Tag";
import PhotoUpdate from "./PhotoUpdate";

// --- Navigation Items ---
const NAV_ITEMS = [
  {
    key: "forms",
    label: "Forms",
    icon: <MdEdit />,
    children: [
      { key: "Form", label: "Form", icon: <MdPerson /> },
    ],
  },
  {
    key: "tag",
    label: "Tag & Photo",
    icon: <MdEdit />,
    children: [
      { key: "Tag", label: "Tag", icon: <MdPerson /> },
      { key: "PhotoUpdate", label: "Photo Update", icon: <MdPerson /> },
    ],
  },
  {
    key: "report",
    label: "Reports",
    icon: <MdBarChart />,
    children: [
      { key: "HajjReport", label: "Hajj Report", icon: <MdBarChart /> },
      { key: "DataAudit", label: "Data Audit", icon: <MdBarChart /> },
      { key: "SCodeReport", label: "SCode Report", icon: <MdBarChart /> },
      { key: "PCodeReport", label: "PCode Report", icon: <MdBarChart /> },
      { key: "GeneralSeriesReport", label: "General Series Report", icon: <MdBarChart /> },
      { key: "DistrictFullReport", label: "District Full Report", icon: <MdBarChart /> },
    ],
  },
];

// --- Custom Button Component ---
const Button = ({ variant = "default", onClick, className = "", children }) => {
  const baseStyles =
    "inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variantStyles =
    variant === "default"
      ? "bg-indigo-600 text-white shadow hover:bg-indigo-700"
      : "hover:bg-indigo-100 hover:text-indigo-700 text-gray-700";

  return (
    <button onClick={onClick} className={`${baseStyles} ${variantStyles} ${className} h-9 px-3 py-2`}>
      {children}
    </button>
  );
};

// --- Default Dashboard Fallback ---
const Dashboard = () => (
  <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Welcome to Admin Dashboard!</h2>
    <p className="mt-2 text-sm text-gray-600">Select an item from the sidebar navigation to get started.</p>
  </div>
);

// --- Main Admin Panel Component ---
function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openNestedDropdowns, setOpenNestedDropdowns] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleNestedDropdown = (key) => {
    setOpenNestedDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    setSidebarOpen(false); // Auto-close drawer on mobile selection
  };

  // Safe Tailwind indentation map to prevent dynamic class purging issues
  const levelPadding = ["pl-0", "pl-4", "pl-8"];

  const renderNavItems = (items, level = 0) =>
    items.map((item) => (
      <div key={item.key} className={`${levelPadding[level] || "pl-4"} pt-1`}>
        {item.children ? (
          <>
            <Button
              variant={openNestedDropdowns[item.key] ? "default" : "ghost"}
              onClick={() => toggleNestedDropdown(item.key)}
              className={`w-full justify-start flex items-center gap-2 py-2 ${
                level === 0 ? "text-sm font-semibold" : "text-xs"
              }`}
            >
              {item.icon} <span className="truncate">{item.label}</span>
              <MdKeyboardArrowDown
                size={16}
                className={`ml-auto shrink-0 transition-transform ${
                  openNestedDropdowns[item.key] ? "rotate-180" : ""
                }`}
              />
            </Button>
            {openNestedDropdowns[item.key] && (
              <div className="space-y-1 mt-1">{renderNavItems(item.children, level + 1)}</div>
            )}
          </>
        ) : (
          <Button
            variant={activeTab === item.key ? "default" : "ghost"}
            onClick={() => handleTabClick(item.key)}
            className={`w-full justify-start flex items-center gap-2 py-1.5 ${
              level === 0 ? "text-sm font-semibold" : "text-xs"
            }`}
          >
            {item.icon} <span className="truncate">{item.label}</span>
          </Button>
        )}
      </div>
    ));

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <HajjDashboard />;
      case "Form":
        return <HajjForm />;
      case "Tag":
        return <Tag />;
      case "PhotoUpdate":
        return <PhotoUpdate />;
      case "HajjReport":
        return <HajjReport />;
      case "DataAudit":
        return <DataAudit />;
      case "SCodeReport":
        return <SCodeReport />;
      case "PCodeReport":
        return <PCodeReport />;
      case "GeneralSeriesReport":
        return <GeneralSeriesReport />;
      case "DistrictFullReport":
        return <DistrictFullReport />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 border-r border-gray-200 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-black tracking-tight text-indigo-700">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1 pr-1">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => handleTabClick("dashboard")}
            className="w-full justify-start flex items-center gap-2 text-sm font-semibold py-2 mb-2"
          >
            <MdDashboard size={18} /> Dashboard
          </Button>
          {renderNavItems(NAV_ITEMS)}
        </div>
      </aside>

      {/* MOBILE BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* MOBILE TOP NAVBAR */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 md:hidden z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none rounded-lg hover:bg-gray-100"
              aria-label="Open navigation menu"
            >
              <MdMenu size={24} />
            </button>
            <span className="font-bold text-gray-800 text-base truncate">
              {activeTab === "dashboard" ? "Dashboard" : activeTab}
            </span>
          </div>
        </header>

        {/* WORKSPACE VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 w-full max-w-7xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;