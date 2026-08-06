import React, { memo } from "react";

const NextOfKin = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-white/50 p-6 rounded-lg mb-6">
      <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
        <h2 className="text-xl font-semibold">NEXT OF KIN</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Relationship</label>
          <input type="text" name="kinRelationship" value={formData.kinRelationship} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input type="text" name="kinFirstName" value={formData.kinFirstName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700">Address</label>
          <input type="text" name="kinAddress" value={formData.kinAddress} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-700">Phone Number(s)</label>
          <input type="tel" name="kinPhone" value={formData.kinPhone} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-gray-700">Email Address</label>
        <input type="email" name="kinEmail" value={formData.kinEmail} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
      </div>
    </div>
  );
};

export default memo(NextOfKin);