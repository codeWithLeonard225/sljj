import React, { useState } from "react";
import CameraCapture from "./CameraCapture";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed

const HajjForm = () => {
  const [formData, setFormData] = useState({
    // Residing in SL is a radio button, the other three are for 'No'
    residingInSL: "Yes",
    residenceCountry: "", // Input for 'No'
    residenceAgency: "", // Input for 'No'
    residenceState: "", // Input for 'No'

    firstName: "",
    middleName: "",
    lastName: "",
    maritalStatus: "",
    gender: "",
    dob: "",
    age: "",
    occupation: "",
    localLanguage: "",
    hajjBefore: "No",
    hajjYear: "",
    passportNumber: "",
    passportIssuePlace: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    districts: [],
    residentialAddress: "",
    otherAddress: "",
    email: "",
    phone: "",
    kinRelationship: "",
    kinFirstName: "",
    kinAddress: "",
    kinPhone: "",
    kinEmail: "",
    dietNeeds: "No",
    dietDetails: "",
    medicalCondition: "No",
    medicalDetails: "",
    covidVaccine: "No",
    covidVaccineName: "",
    vaccineDate: "",
    convicted: "No",
    deported: "No",
    pilgrimPhoto: null,
    passportPhoto: null,
  });

  const [showCameraFor, setShowCameraFor] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const isResidingInSL = formData.residingInSL === "Yes";

  const districts = [
    'Bo', 'Bonthe', 'Falaba', 'Kailahun', 'Kambia', 'Kenema', 'Kono', 'Moyamba',
    'Portloko', 'Pujehun', 'Tonkolili', 'W. Urban', 'W. Rural', 'Koinadugu'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      // The original logic for 'districts' assumed checkboxes, but the UI uses radio buttons.
      // I've kept the `setSelectedDistrict` state for the UI, and will handle it in handleSubmit.
      [name]: value,
    }));
  };

  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setFormData(prevData => ({ ...prevData, dob: selectedDob }));

    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setFormData(prevData => ({ ...prevData, age: calculatedAge >= 0 ? calculatedAge.toString() : '' }));
    } else {
      setFormData(prevData => ({ ...prevData, age: '' }));
    }
  };

  const handlePhotoChange = (e, photoType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({ ...prevData, [photoType]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prevData => ({ ...prevData, [photoType]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission

    try {
      const dataToSave = {
        ...formData,
        // Ensure only one district is saved (as per radio button UI)
        districts: selectedDistrict ? [selectedDistrict] : [],
        // Clear foreign residence data if residing in SL, and vice-versa
        ...(isResidingInSL ? { residenceCountry: "", residenceAgency: "", residenceState: "" } : {}),
      };

      await addDoc(collection(db, "hajjApplicants"), dataToSave);
      alert("Form submitted successfully!");

      // Optional: reset form
      setFormData({
        residingInSL: "Yes",
        residenceCountry: "",
        residenceAgency: "",
        residenceState: "",
        firstName: "",
        middleName: "",
        lastName: "",
        maritalStatus: "",
        gender: "",
        dob: "",
        age: "",
        occupation: "",
        localLanguage: "",
        hajjBefore: "No",
        hajjYear: "",
        passportNumber: "",
        passportIssuePlace: "",
        passportIssueDate: "",
        passportExpiryDate: "",
        districts: [],
        residentialAddress: "",
        otherAddress: "",
        email: "",
        phone: "",
        kinRelationship: "",
        kinFirstName: "",
        kinAddress: "",
        kinPhone: "",
        kinEmail: "",
        dietNeeds: "No",
        dietDetails: "",
        medicalCondition: "No",
        medicalDetails: "",
        covidVaccine: "No",
        covidVaccineName: "",
        vaccineDate: "",
        convicted: "No",
        deported: "No",
        pilgrimPhoto: null,
        passportPhoto: null,
      });
      setSelectedDistrict("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error submitting form. Please try again.");
    }
  };

  const handleCameraCapture = (dataUrl) => {
    if (showCameraFor === "pilgrim") {
      setFormData(prevData => ({ ...prevData, pilgrimPhoto: dataUrl }));
    } else if (showCameraFor === "passport") {
      setFormData(prevData => ({ ...prevData, passportPhoto: dataUrl }));
    }
    setShowCameraFor(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit}>
        <div
          className="min-h-screen flex justify-center items-start bg-gray-100"
          style={{
            backgroundImage: "url('/images/needed.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <div
            className="bg-white/70 rounded-lg p-4 sm:p-6 overflow-auto w-full max-w-4xl" // Added max-width for better form structure
          >
            <header className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <img
                  src="/images/s-l1200.jpg"
                  alt="Sierra Leone Coat of Arms"
                  className="h-24"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">GOVERNMENT OF SIERRA LEONE</h1>
              <h2 className="text-lg sm:text-xl font-semibold">PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT</h2>
              <p className="text-xs sm:text-sm mt-2">
                Old Gym House, Bank of Sierra Leone Complex, Kingtom, Freetown
              </p>
              <p className="text-xs sm:text-sm">
                Tel: +23273292929; Email: info@sierraleonehajj.org; Website: www.sierraleonehajj.org
              </p>
              <hr />
              <h1 className="text-xl sm:text-2xl font-bold mt-8 text-blue-800">
                HAJJ 2026 APPLICATION FORM
              </h1>
            </header>

            <div className="bg-white/50 p-6 rounded-lg mb-6 shadow-md">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  PILGRIM'S PERSONAL INFORMATION
                  <span className="text-sm font-normal italic text-gray-600">(AS PER NATIONAL PASSPORT)</span>
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
                <label className="mb-2 md:mb-0 mr-4 text-gray-700 font-medium">Are you currently residing in Sierra Leone?</label>
                <div className="flex items-center space-x-4">
                  <label><input type="radio" name="residingInSL" value="Yes" checked={isResidingInSL} onChange={handleInputChange} className="mr-1 accent-blue-500" /> Yes</label>
                  <label><input type="radio" name="residingInSL" value="No" checked={!isResidingInSL} onChange={handleInputChange} className="mr-1 accent-blue-500" /> No</label>
                </div>
              </div>

              {!isResidingInSL && (
                <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                  <label className="block mb-3 text-gray-700 font-medium">If No, where do you reside?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input type="text" name="residenceCountry" placeholder="Country" value={formData.residenceCountry} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    <input type="text" name="residenceAgency" placeholder="Agency" value={formData.residenceAgency} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    <input type="text" name="residenceState" placeholder="State/City" value={formData.residenceState} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  {/* Removed the redundant checkboxes and extra input fields from the original UI */}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
                <label className="text-gray-700 font-medium">Marital Status</label>
                <div className="flex space-x-4">
                  <label><input type="radio" name="maritalStatus" value="Single" checked={formData.maritalStatus === "Single"} onChange={handleInputChange} className="mr-1 accent-blue-500" required /> Single</label>
                  <label><input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === "Married"} onChange={handleInputChange} className="mr-1 accent-blue-500" required /> Married</label>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
                <label className="text-gray-700 font-medium">Gender</label>
                <div className="flex space-x-4">
                  <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleInputChange} className="mr-1 accent-blue-500" required /> Male</label>
                  <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleInputChange} className="mr-1 accent-blue-500" required /> Female</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleDobChange}
                    className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Age</label>
                  <input type="text" name="age" value={formData.age} readOnly className="w-full p-2 border-b border-gray-400 bg-gray-100 text-gray-600" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Local Language</label>
                <input type="text" name="localLanguage" value={formData.localLanguage} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
                <label className="text-gray-700 font-medium">Have you performed Hajj before?</label>
                <div className="flex space-x-4 flex-wrap items-center">
                  <label><input type="radio" name="hajjBefore" value="Yes" checked={formData.hajjBefore === "Yes"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> Yes</label>
                  <label><input type="radio" name="hajjBefore" value="No" checked={formData.hajjBefore === "No"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> No</label>
                  {formData.hajjBefore === "Yes" && (
                    <input type="text" name="hajjYear" placeholder="If Yes, year(s)" value={formData.hajjYear} onChange={handleInputChange} className="p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none mt-2 md:mt-0 w-full md:w-auto" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center mb-4 p-4 border border-blue-200 rounded-md bg-blue-50">
                <label className="font-medium text-gray-700 mb-2">Pilgrim Photo (2-inch)</label>
                <div className="border-4 border-dashed border-gray-400 w-36 h-48 flex items-center justify-center bg-white/80 rounded-sm overflow-hidden shadow-inner">
                  {formData.pilgrimPhoto ? (
                    <img src={formData.pilgrimPhoto} alt="Pilgrim" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-gray-500">2-inch Photo</span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <input
                    id="pilgrim-photo-input"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handlePhotoChange(e, "pilgrimPhoto")}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("pilgrim-photo-input").click()}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-150"
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCameraFor("pilgrim")}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-150"
                  >
                    Use Camera
                  </button>
                </div>
                {/* Optional: Add a clear button */}
                {formData.pilgrimPhoto && (
                  <button
                    type="button"
                    onClick={() => setFormData(prevData => ({ ...prevData, pilgrimPhoto: null }))}
                    className="mt-2 text-red-500 text-xs hover:text-red-700"
                  >
                    Clear Photo
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-6 shadow-md">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  PASSPORT INFORMATION
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium">Passport Number</label>
                  <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Place of issue</label>
                  <input type="text" name="passportIssuePlace" value={formData.passportIssuePlace} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium">Date of issue</label>
                  <input type="date" name="passportIssueDate" value={formData.passportIssueDate} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Date of expiry</label>
                  <input type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
              </div>

              <div className="flex flex-col items-center p-4 border border-blue-200 rounded-md bg-blue-50">
                <label className="font-medium text-gray-700 mb-2">Passport Book (Photo Page)</label>
                <div className="border-4 border-dashed border-gray-400 w-36 h-48 flex items-center justify-center bg-white/80 rounded-sm overflow-hidden shadow-inner">
                  {formData.passportPhoto ? (
                    <img src={formData.passportPhoto} alt="Passport" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-gray-500">Passport Photo</span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <input
                    id="passport-photo-input"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handlePhotoChange(e, "passportPhoto")}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("passport-photo-input").click()}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-150"
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCameraFor("passport")}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-150"
                  >
                    Use Camera
                  </button>
                </div>
                {/* Optional: Add a clear button */}
                {formData.passportPhoto && (
                  <button
                    type="button"
                    onClick={() => setFormData(prevData => ({ ...prevData, passportPhoto: null }))}
                    className="mt-2 text-red-500 text-xs hover:text-red-700"
                  >
                    Clear Photo
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-6 shadow-md">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  ADDRESS AND CONTACT DETAILS
                </h2>
              </div>
              <label className="block text-gray-700 font-medium mb-2">District of Origin</label>
              <div className="flex flex-wrap gap-x-4 sm:gap-x-12 gap-y-2 mb-4 p-3 border border-gray-300 rounded-md bg-gray-50">
                {districts.map((district) => (
                  <label key={district} className="flex items-center">
                    <input
                      type="radio"
                      name="district"
                      value={district}
                      checked={selectedDistrict === district}
                      onChange={() => setSelectedDistrict(district)}
                      className="mr-2 accent-blue-500"
                      required={isResidingInSL} // Make required only if residing in SL
                    />
                    {district}
                  </label>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium">Present residential address</label>
                <input type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium">Other address (if any)</label>
                  <input type="text" name="otherAddress" value={formData.otherAddress} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-700 font-medium">Phone Number(s)</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-6 shadow-md">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  NEXT OF KIN
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium">Relationship</label>
                  <input type="text" name="kinRelationship" value={formData.kinRelationship} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Full Name</label>
                  <input type="text" name="kinFirstName" value={formData.kinFirstName} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium">Address</label>
                  <input type="text" name="kinAddress" value={formData.kinAddress} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Phone Number(s)</label>
                  <input type="tel" name="kinPhone" value={formData.kinPhone} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email Address (Optional)</label>
                <input type="email" name="kinEmail" value={formData.kinEmail} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-6 shadow-md">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  MEDICAL - HEALTH DECLARATION
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <label className="block text-gray-700 font-medium mb-2">Do you have any special dietary needs?</label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label><input type="radio" name="dietNeeds" value="Yes" checked={formData.dietNeeds === "Yes"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> Yes</label>
                    <label><input type="radio" name="dietNeeds" value="No" checked={formData.dietNeeds === "No"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> No</label>
                  </div>
                  {formData.dietNeeds === "Yes" && (
                    <input type="text" name="dietDetails" placeholder="If Yes, provide details" value={formData.dietDetails} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                  )}
                </div>

                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <label className="block text-gray-700 font-medium mb-2">Do you have any medical condition(s)?</label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label><input type="radio" name="medicalCondition" value="Yes" checked={formData.medicalCondition === "Yes"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> Yes</label>
                    <label><input type="radio" name="medicalCondition" value="No" checked={formData.medicalCondition === "No"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> No</label>
                  </div>
                  {formData.medicalCondition === "Yes" && (
                    <input type="text" name="medicalDetails" placeholder="If Yes, provide details" value={formData.medicalDetails} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                  )}
                </div>
                
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <label className="block text-gray-700 font-medium mb-2">Have you taken covid vaccination(s)?</label>
                  <div className="flex items-center space-x-4 mb-2">
                    <label><input type="radio" name="covidVaccine" value="Yes" checked={formData.covidVaccine === "Yes"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> Yes</label>
                    <label><input type="radio" name="covidVaccine" value="No" checked={formData.covidVaccine === "No"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> No</label>
                  </div>
                  {formData.covidVaccine === "Yes" && (
                    <input type="text" name="covidVaccineName" placeholder="If Yes, name of vaccine" value={formData.covidVaccineName} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" required />
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">Vaccination Date</label>
                  <input type="date" name="vaccineDate" value={formData.vaccineDate} onChange={handleInputChange} className="w-full p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-8 shadow-md">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  DECLARATION
                </h2>
              </div>
              <div className="space-y-4 mb-6">
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <label className="text-gray-700 font-medium mb-2 block">Have you ever been convicted?</label>
                  <div className="flex items-center space-x-4">
                    <label><input type="radio" name="convicted" value="Yes" checked={formData.convicted === "Yes"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> Yes</label>
                    <label><input type="radio" name="convicted" value="No" checked={formData.convicted === "No"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> No</label>
                  </div>
                  {formData.convicted === "Yes" && (
                    <input type="text" placeholder="If Yes, when was the last time?" name="convictedDetails" className="w-full mt-2 p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
                  )}
                </div>
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <label className="text-gray-700 font-medium mb-2 block">Have you ever been deported from Saudi Arabia?</label>
                  <div className="flex items-center space-x-4">
                    <label><input type="radio" name="deported" value="Yes" checked={formData.deported === "Yes"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> Yes</label>
                    <label><input type="radio" name="deported" value="No" checked={formData.deported === "No"} onChange={handleInputChange} className="mr-1 accent-blue-500" /> No</label>
                  </div>
                  {formData.deported === "Yes" && (
                    <input type="text" placeholder="If Yes, when?" name="deportedDetails" className="w-full mt-2 p-2 border-b border-gray-400 focus:border-blue-500 focus:outline-none" />
                  )}
                </div>
              </div>
              <p className="italic text-sm text-gray-600 mb-6 p-2 bg-yellow-100 border-l-4 border-yellow-500">
                I hereby confirm that the information I have provided is true to the best of my knowledge.
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-end mt-8">
                <div className="w-full sm:w-1/2 mb-4 sm:mb-0 sm:pr-4">
                  <div className="border-b border-black h-8 mb-2"></div>
                  <p className="text-xs text-gray-500">Signature/Thumb Print</p>
                </div>
                <div className="w-full sm:w-1/2">
                  <div className="border-b border-black h-8 mb-2"></div>
                  <p className="text-xs text-gray-500">Date</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-200 ease-in-out shadow-lg"
            >
              SUBMIT APPLICATION
            </button>


            {/* OFFICIAL USE SECTION (Unchanged, as it's static) */}
            <div className="mt-10">
              <div className=" bg-gray-300 px-4 py-1 rounded-full text-sm font-bold text-gray-900 text-center">
                FOR OFFICIAL USE ONLY
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-6 border-t border-gray-300 mt-4">
                <div className="flex flex-col space-y-2 mb-4 sm:mb-0">
                  <p className="text-sm font-medium">Requirements and eligibility for performing Hajj</p>
                  <p className="text-sm italic text-gray-600">(Please check the appropriate box)</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 accent-blue-500" /> Finance
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 accent-blue-500" /> Health
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2 accent-blue-500" /> Documents
                    </label>
                  </div>
                </div>

                <div className="flex flex-col items-start w-full sm:w-1/3">
                  <div className="flex items-center space-x-2 mb-4 w-full">
                    <p className="text-sm font-medium whitespace-nowrap">SLHS No:</p>
                    <input type="text" className="w-full border-b border-gray-400 bg-transparent focus:outline-none" />
                  </div>
                  <div className="flex items-center space-x-2 w-full">
                    <p className="text-sm font-medium whitespace-nowrap">Date:</p>
                    <input type="date" className="w-full border-b border-gray-400 bg-transparent focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
      
      {/* Camera Capture Modal */}
      {showCameraFor && (
        <CameraCapture
          setPhoto={handleCameraCapture}
          onClose={() => setShowCameraFor(null)} // Added a way to close the camera
        />
      )}
    </div>
  );
};

export default HajjForm;