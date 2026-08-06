import React, { memo } from "react";
import CloudinaryImageUploader from "../../CaptureCamera/CloudinaryImageUploader";
import { calculatePassportExpiry } from "../utils/hajjHelpers";

const PassportInformation = ({ formData, handleInputChange, setShowCameraFor, setFormData }) => {
  const handleIssueDateChange = (e) => {
    handleInputChange(e);
    const expiry = calculatePassportExpiry(e.target.value);
    if (expiry) {
      setFormData(prev => ({ ...prev, passportExpiryDate: expiry }));
    }
  };

  return (
    <div className="bg-white/50 p-6 rounded-lg mb-6">
      <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
        <h2 className="text-xl font-semibold">PASSPORT INFORMATION</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Passport Number</label>
          <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-700">Place of issue</label>
          <input type="text" name="passportIssuePlace" value={formData.passportIssuePlace} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Date of issue</label>
          <input type="date" name="passportIssueDate" value={formData.passportIssueDate || ""} onChange={handleIssueDateChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-700">Date of expiry</label>
          <input type="date" name="passportExpiryDate" value={formData.passportExpiryDate || ""} readOnly className="w-full border-b border-gray-400 focus:outline-none bg-gray-50" />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <label className="mb-2">Passport Book</label>
        <div className="border-4 border-dashed w-60 h-48 flex items-center justify-center bg-white/30 mb-2">
          {formData.passportPhoto ? (
            <img src={formData.passportPhoto} alt="Passport" className="w-full h-full object-cover" />
          ) : (
            "Passport Photo"
          )}
        </div>
        <CloudinaryImageUploader
          field="passportPhoto"
          onUploadSuccess={(url, field) => setFormData(prev => ({ ...prev, [field]: url }))}
        />
        <button
          type="button"
          onClick={() => setShowCameraFor("passport")}
          className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded-md text-sm font-semibold mt-2"
        >
          Use Camera
        </button>
      </div>
    </div>
  );
};

export default memo(PassportInformation);