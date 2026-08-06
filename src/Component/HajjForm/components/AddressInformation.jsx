import React, { memo } from "react";
import { DISTRICTS } from "../utils/hajjHelpers";

const AddressInformation = ({ formData, handleInputChange, selectedDistrict, setSelectedDistrict }) => {
  return (
    <div className="bg-white/50 p-6 rounded-lg mb-6">
      <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
        <h2 className="text-xl font-semibold">ADDRESS AND CONTACT DETAILS</h2>
      </div>

      <div className="flex flex-wrap gap-x-4 sm:gap-x-12 gap-y-2 mb-4">
        {DISTRICTS.map((district) => (
          <label key={district} className="flex items-center">
            <input
              type="radio"
              name="district"
              value={district}
              checked={selectedDistrict === district}
              onChange={() => setSelectedDistrict(district)}
              className="mr-2"
            />
            {district}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Place of Birth</label>
        <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none mb-4" />
        
        <label className="block text-gray-700 mb-1">Present residential address</label>
        <input type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Other address (if any)</label>
          <input type="text" name="otherAddress" value={formData.otherAddress} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
        <div>
          <label className="block text-gray-700">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-gray-700">Phone Number(s)</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
        </div>
      </div>
    </div>
  );
};

export default memo(AddressInformation);