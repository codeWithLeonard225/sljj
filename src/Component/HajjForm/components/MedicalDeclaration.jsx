import React, { memo } from "react";

const MedicalDeclaration = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-white/50 p-6 rounded-lg mb-6">
      <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
        <h2 className="text-xl font-semibold">MEDICAL - HEALTH DECLARATION</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Do you have any special dietary needs?</label>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <label><input type="radio" name="dietNeeds" value="Yes" checked={formData.dietNeeds === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
              <label><input type="radio" name="dietNeeds" value="No" checked={formData.dietNeeds === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
            </div>
            {formData.dietNeeds === "Yes" && (
              <input type="text" name="dietDetails" placeholder="If Yes, provide details" value={formData.dietDetails} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Do you have any medical condition(s)?</label>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <label><input type="radio" name="medicalCondition" value="Yes" checked={formData.medicalCondition === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
              <label><input type="radio" name="medicalCondition" value="No" checked={formData.medicalCondition === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
            </div>
            {formData.medicalCondition === "Yes" && (
              <input type="text" name="medicalDetails" placeholder="If Yes, provide details" value={formData.medicalDetails} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Have you taken covid vaccination(s)?</label>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <label><input type="radio" name="covidVaccine" value="Yes" checked={formData.covidVaccine === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
              <label><input type="radio" name="covidVaccine" value="No" checked={formData.covidVaccine === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
            </div>
            {formData.covidVaccine === "Yes" && (
              <input type="text" name="covidVaccineName" placeholder="If Yes, name of vaccine" value={formData.covidVaccineName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Date</label>
          <input type="date" name="vaccineDate" value={formData.vaccineDate} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
      </div>
    </div>
  );
};

export default memo(MedicalDeclaration);