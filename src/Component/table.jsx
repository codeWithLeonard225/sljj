import React, { useState } from "react";

const HajjForm = () => {
  const [pilgrims, setPilgrims] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    passport: "",
    district: "",
    age: "",
  });

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add pilgrim
  const handleSubmit = (e) => {
    e.preventDefault();
    setPilgrims([...pilgrims, { ...formData, id: Date.now() }]);
    setFormData({ firstName: "", lastName: "", passport: "", district: "", age: "" });
  };

  // Delete pilgrim
  const handleDelete = (id) => {
    setPilgrims(pilgrims.filter((p) => p.id !== id));
  };

  return (
    <div className="flex gap-6 p-4">
      {/* Left: Form */}
      <div
        className="bg-white/70 rounded-lg p-6 shadow-md"
        style={{ width: "210mm", height: "297mm" }}
      >
        <h2 className="text-xl font-bold mb-4">Hajj 2025 Application Form</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border-b border-gray-400"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border-b border-gray-400"
          />
          <input
            type="text"
            name="passport"
            placeholder="Passport No."
            value={formData.passport}
            onChange={handleChange}
            className="w-full border-b border-gray-400"
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            className="w-full border-b border-gray-400"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full border-b border-gray-400"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        </form>
      </div>

      {/* Right: Registered Pilgrims */}
      <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-md overflow-auto">
        <h2 className="text-lg font-bold mb-4">Registered Pilgrims</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Passport</th>
              <th className="p-2 border">District</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pilgrims.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2 border">{p.firstName} {p.lastName}</td>
                <td className="p-2 border">{p.passport}</td>
                <td className="p-2 border">{p.district}</td>
                <td className="p-2 border">{p.age}</td>
                <td className="p-2 border space-x-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded">Update</button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pilgrims.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No pilgrims registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HajjForm;
