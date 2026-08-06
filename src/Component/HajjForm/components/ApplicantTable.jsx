import React, { memo } from "react";

const ApplicantTable = ({
  submissions,
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  handleEdit,
  handleDelete,
  handlePrint,
  editingId,
}) => {
  return (
    <div className="mt-8 sm:mt-12 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 w-full min-w-0">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-blue-800">
        Submitted Applications ({submissions ? submissions.length : 0})
      </h3>
      
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Name, District, Passport or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2.5 rounded-lg w-full md:w-2/3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 p-2.5 rounded-lg w-full md:w-1/3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Application Years</option>
          <option value="2027">2027</option>
          <option value="2026">2026</option>
        </select>
      </div>

      {/* 1. MOBILE CARD VIEW (Shown under 768px) */}
      <div className="block md:hidden space-y-4">
        {submissions && submissions.length > 0 ? (
          submissions.map((sub) => (
            <div
              key={sub.id}
              className={`p-4 rounded-lg border ${
                editingId === sub.id ? "bg-yellow-50 border-yellow-400" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    SLH6: {sub.slh6 || "N/A"}
                  </span>
                  <h4 className="font-bold text-gray-900 mt-1">
                    {sub.fullName || `${sub.concatenatedFirstName || ''} ${sub.lastName || ''}`}
                  </h4>
                </div>
              </div>

              <div className="text-xs space-y-1 text-gray-600 mb-3">
                <p><span className="font-semibold text-gray-700">District:</span> {Array.isArray(sub.districts) ? sub.districts.join(", ") : sub.district || "N/A"}</p>
                <p><span className="font-semibold text-gray-700">Passport:</span> {sub.passportNumber || "N/A"}</p>
                <p><span className="font-semibold text-gray-700">Phone:</span> {sub.phone || "N/A"}</p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleEdit(sub)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 rounded text-xs font-semibold transition text-center"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sub.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-xs font-semibold transition text-center"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => handlePrint(sub)}
                  className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-1.5 rounded text-xs font-semibold transition text-center"
                >
                  Print
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-gray-500 text-sm">
            No applications submitted yet.
          </div>
        )}
      </div>

      {/* 2. DESKTOP TABLE VIEW (Shown 768px and up) */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full bg-white text-left border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">SLH6</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">District</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Passport No.</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider">Phone</th>
              <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions && submissions.length > 0 ? (
              submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className={`transition-colors ${
                    editingId === sub.id ? "bg-yellow-100" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800">{sub.slh6 || "N/A"}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {sub.fullName || `${sub.concatenatedFirstName || ''} ${sub.lastName || ''}`}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {Array.isArray(sub.districts)
                      ? sub.districts.join(", ")
                      : sub.district || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{sub.passportNumber || "N/A"}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{sub.phone || "N/A"}</td>
                  <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleEdit(sub)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sub.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrint(sub)}
                      className="bg-gray-700 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-gray-800 transition"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500 text-sm">
                  No applications submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ApplicantTable);