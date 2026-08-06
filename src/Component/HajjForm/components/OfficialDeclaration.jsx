import React, { memo } from "react";

const OfficialDeclaration = ({ formData, handleInputChange }) => {
  return (
    <>
      {/* DECLARATION SECTION */}
      <div className="bg-white/50 p-6 rounded-lg mb-6">
        <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
          <h2 className="text-xl font-semibold">DECLARATION</h2>
        </div>

        <div className="space-y-4 mb-6">
          {/* CONVICTED QUESTION */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="text-gray-700 mb-2 md:mb-0 mr-4">
              Have you ever been convicted?
            </label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="convicted"
                  value="Yes"
                  checked={formData.convicted === "Yes"}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="convicted"
                  value="No"
                  checked={formData.convicted === "No"}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                No
              </label>
            </div>
            {formData.convicted === "Yes" && (
              <input
                type="text"
                name="convictedDate"
                placeholder="If Yes, when was the last time?"
                value={formData.convictedDate || ""}
                onChange={handleInputChange}
                className="w-full ml-0 md:ml-4 border-b border-gray-400 focus:outline-none"
              />
            )}
          </div>

          {/* DEPORTED QUESTION */}
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="text-gray-700 mb-2 md:mb-0 mr-4">
              Have you ever been deported from Saudi Arabia?
            </label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="deported"
                  value="Yes"
                  checked={formData.deported === "Yes"}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="deported"
                  value="No"
                  checked={formData.deported === "No"}
                  onChange={handleInputChange}
                  className="mr-1"
                />{" "}
                No
              </label>
            </div>
            {formData.deported === "Yes" && (
              <input
                type="text"
                name="deportedDate"
                placeholder="If Yes, when?"
                value={formData.deportedDate || ""}
                onChange={handleInputChange}
                className="w-full ml-0 md:ml-4 border-b border-gray-400 focus:outline-none"
              />
            )}
          </div>
        </div>

        <p className="italic text-sm text-gray-600 mb-6">
          I hereby confirm that the information I have provided is true to the best of my knowledge.
        </p>

        {/* SIGNATURE & DATE */}
        <div className="flex flex-col sm:flex-row justify-between items-end mt-8">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0 sm:mr-4">
            <div className="border-b border-black h-8 mb-2"></div>
            <p className="text-xs text-gray-500">Signature/Thumb Print</p>
          </div>
          <div className="w-full sm:w-1/2">
            <div className="border-b border-black h-8 mb-2"></div>
            <p className="text-xs text-gray-500">Date</p>
          </div>
        </div>
      </div>

      {/* FOR OFFICIAL USE ONLY SECTION */}
      <div className="bg-gray-100 px-4 py-1 rounded-full text-sm font-semibold text-blue-800 text-center">
        FOR OFFICIAL USE ONLY
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-6 mb-6">
        <div className="flex flex-col space-y-2 mb-4 sm:mb-0">
          <p className="text-sm">Requirements and eligibility for performing Hajj</p>
          <p className="text-sm italic">(Please check the appropriate box)</p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Finance
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Health
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Documents
            </label>
          </div>
        </div>

        <div className="flex flex-col items-start w-full sm:w-1/3">
          <div className="flex items-center space-x-2 mb-4 w-full">
            <label className="text-sm whitespace-nowrap">SLH6 No</label>
            <input
              type="text"
              name="slh6"
              value={formData.slh6 || ""}
              onChange={handleInputChange}
              className="w-full border-b border-gray-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2 mb-4 w-full">
            <label className="text-sm whitespace-nowrap">NiN No</label>
            <input
              type="text"
              name="nunNo"
              value={formData.nunNo || ""}
              onChange={handleInputChange}
              className="w-full border-b border-gray-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full">
            <p className="text-sm">Date</p>
            <input type="date" className="w-full border-b border-gray-400 focus:outline-none" />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(OfficialDeclaration);