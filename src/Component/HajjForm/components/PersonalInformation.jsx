import React, { memo } from "react";
import CloudinaryImageUploader from "../../CaptureCamera/CloudinaryImageUploader";

const PersonalInformation = ({ formData, handleInputChange, handleDobChange, setShowCameraFor, setFormData }) => {
  return (
    <div className="bg-white/50 p-6 rounded-lg mb-6">
      <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
        <h2 className="text-xl font-semibold">
          PILGRIM'S PERSONAL INFORMATION{" "}
          <span className="text-sm font-normal italic text-gray-600">(AS PER NATIONAL PASSPORT)</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
        <label className="mb-2 md:mb-0 mr-4 text-gray-700">Are you currently residing in Sierra Leone?</label>
        <div className="flex items-center space-x-4">
          <label><input type="radio" name="residingInSL" value="Yes" checked={formData.residingInSL === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
          <label><input type="radio" name="residingInSL" value="No" checked={formData.residingInSL === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
        <label className="text-gray-700">Marital Status</label>
        <div className="flex space-x-4">
          <label><input type="radio" name="maritalStatus" value="Single" checked={formData.maritalStatus === "Single"} onChange={handleInputChange} className="mr-1" /> Single</label>
          <label><input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === "Married"} onChange={handleInputChange} className="mr-1" /> Married</label>
          <label><input type="radio" name="maritalStatus" value="Widow" checked={formData.maritalStatus === "Widow"} onChange={handleInputChange} className="mr-1" /> Widow</label>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
        <label className="text-gray-700">Gender</label>
        <div className="flex space-x-4">
          <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleInputChange} className="mr-1" /> Male</label>
          <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleInputChange} className="mr-1" /> Female</label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleDobChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-700">Age</label>
          <input type="text" name="age" value={formData.age} readOnly className="w-full border-b border-gray-400 focus:outline-none bg-gray-50" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Occupation</label>
        <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Local Language</label>
        <input type="text" name="localLanguage" value={formData.localLanguage} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
        <label className="text-gray-700">Have you performed Hajj before?</label>
        <div className="flex space-x-4 flex-wrap">
          <label><input type="radio" name="hajjBefore" value="Yes" checked={formData.hajjBefore === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
          <label><input type="radio" name="hajjBefore" value="No" checked={formData.hajjBefore === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
          {formData.hajjBefore === "Yes" && (
            <input type="text" name="hajjYear" placeholder="If Yes, year(s)" value={formData.hajjYear} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none mt-2" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mb-4">
        <label className="mb-2">Pilgrim Photo</label>
        <div className="border-4 border-dashed w-36 h-48 flex items-center justify-center bg-white/30 mb-2">
          {formData.pilgrimPhoto ? (
            <img src={formData.pilgrimPhoto} alt="Pilgrim" className="w-full h-full object-cover" />
          ) : (
            "2-inch Photo"
          )}
        </div>
        <CloudinaryImageUploader
          field="pilgrimPhoto"
          onUploadSuccess={(url, field) => setFormData(prev => ({ ...prev, [field]: url }))}
        />
        <button
          type="button"
          onClick={() => setShowCameraFor("pilgrim")}
          className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded-md text-sm font-semibold mt-2"
        >
          Use Camera
        </button>
      </div>
    </div>
  );
};

export default memo(PersonalInformation);