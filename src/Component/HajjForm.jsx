import React, { useState } from "react";
import CameraCapture from "./CameraCapture";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed

const HajjForm = () => {

  const [formData, setFormData] = useState({
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

  const [showCameraFor, setShowCameraFor] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const districts = [
    'Bo', 'Bonthe', 'Falaba', 'Kailahun', 'Kambia', 'Kenema', 'Kono', 'Moyamba',
    'Portloko', 'Pujehun', 'Tonkolili', 'W. Urban', 'W. Rural', 'Koinadugu'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? [...prevData.districts, value] : prevData.districts.filter(d => d !== value)) : value,
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
      // Optional: include the selected district
      const dataToSave = {
        ...formData,
        districts: selectedDistrict ? [selectedDistrict] : formData.districts
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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit}>
        <div
          className="min-h-screen flex justify-center items-start p-4 bg-gray-100"
          style={{
            backgroundImage: "url('/images/needed.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <div
            className="bg-white/70 rounded-lg p-4 sm:p-6 overflow-auto" // Added a smaller padding for small screens
          >
            <header className="text-center mb-8">
              <div className="flex justify-center items-center mb-4">
                <img
                  src="/images/s-l1200.jpg"
                  alt="Sierra Leone Coat of Arms"
                  className="h-24"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">GOVERNMENT OF SIERRA LEONE</h1> {/* Adjusted font sizes */}
              <h2 className="text-lg sm:text-xl font-semibold">PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT</h2> {/* Adjusted font sizes */}
              <p className="text-xs sm:text-sm mt-2"> {/* Adjusted font sizes */}
                Old Gym House, Bank of Sierra Leone Complex, Kingtom, Freetown
              </p>
              <p className="text-xs sm:text-sm"> {/* Adjusted font sizes */}
                Tel: +23273292929; Email: info@sierraleonehajj.org; Website: www.sierraleonehajj.org
              </p>
              <hr />
              <h1 className="text-xl sm:text-2xl font-bold mt-8 text-blue-800"> {/* Adjusted font sizes */}
                HAJJ 2025 APPLICATION FORM
              </h1>
            </header>

            <div className="bg-white/50 p-6 rounded-lg mb-6">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  PILGRIM'S PERSONAL INFORMATION
                  <span className="text-sm font-normal italic text-gray-600">(AS PER NATIONAL PASSPORT)</span>
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center"> {/* Stacks vertically on small screens */}
                <label className="mb-2 md:mb-0 mr-4 text-gray-700">Are you currently residing in Sierra Leone?</label>
                <div className="flex items-center space-x-4">
                  <label><input type="radio" name="residingInSL" value="Yes" checked={formData.residingInSL === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
                  <label><input type="radio" name="residingInSL" value="No" checked={formData.residingInSL === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">If No, where do you reside?</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Changed to 1 column on small screens */}
                  <div className="flex flex-col">
                    <label><input type="checkbox" className="mr-2" /> West Africa</label>
                    <label><input type="checkbox" className="mr-2" /> Europe</label>
                    <label><input type="checkbox" className="mr-2" /> USA/Australia</label>
                  </div>
                  <div className="flex flex-col space-y-2"> {/* Stacked inputs vertically */}
                    <input type="text" placeholder="Country" className="border-b border-gray-400 focus:outline-none" />
                    <input type="text" placeholder="Agency" className="border-b border-gray-400 focus:outline-none" />
                    <input type="text" placeholder="State" className="border-b border-gray-400 focus:outline-none" />
                  </div>
                  <div className="flex flex-col space-y-2"> {/* Stacked inputs vertically */}
                    <input type="text" placeholder="Country" className="border-b border-gray-400 focus:outline-none" />
                    <input type="text" placeholder="Agency" className="border-b border-gray-400 focus:outline-none" />
                    <input type="text" placeholder="State" className="border-b border-gray-400 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
                <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4"> {/* Stacks vertically on small screens */}
                <label className="text-gray-700">Marital Status</label>
                <div className="flex space-x-4">
                  <label><input type="radio" name="maritalStatus" value="Single" checked={formData.maritalStatus === "Single"} onChange={handleInputChange} className="mr-1" /> Single</label>
                  <label><input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === "Married"} onChange={handleInputChange} className="mr-1" /> Married</label>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4"> {/* Stacks vertically on small screens */}
                <label className="text-gray-700">Gender</label>
                <div className="flex space-x-4">
                  <label><input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleInputChange} className="mr-1" /> Male</label>
                  <label><input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleInputChange} className="mr-1" /> Female</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleDobChange}
                    className="w-full border-b border-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Age</label>
                  <input type="text" name="age" value={formData.age} readOnly className="w-full border-b border-gray-400 focus:outline-none" />
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
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-4"> {/* Stacks vertically on small screens */}
                <label className="text-gray-700">Have you performed Hajj before?</label>
                <div className="flex space-x-4 flex-wrap">
                  <label><input type="radio" name="hajjBefore" value="Yes" checked={formData.hajjBefore === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
                  <label><input type="radio" name="hajjBefore" value="No" checked={formData.hajjBefore === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
                  {formData.hajjBefore === "Yes" && (
                    <input type="text" name="hajjYear" placeholder="If Yes, year(s)" value={formData.hajjYear} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center mb-4">
                <label>Pilgrim Photo</label>
                <div className="border-8 border-dashed w-36 h-48 flex items-center justify-center bg-white/30">
                  {formData.pilgrimPhoto ? (
                    <img src={formData.pilgrimPhoto} alt="Pilgrim" className="w-full h-full object-cover" />
                  ) : (
                    "2-inch Photo"
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2"> {/* Buttons are stacked on mobile */}
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
                    className="w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-md text-sm font-semibold"
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCameraFor("pilgrim")}
                    className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded-md text-sm font-semibold"
                  >
                    Use Camera
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-6">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  PASSPORT INFORMATION
                </h2>
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
                  <input type="date" name="passportIssueDate" value={formData.passportIssueDate} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700">Date of expiry</label>
                  <input type="date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label>Passport Book</label>
                <div className="border-8 border-dashed w-36 h-48 flex items-center justify-center bg-white/30">
                  {formData.passportPhoto ? (
                    <img src={formData.passportPhoto} alt="Passport" className="w-full h-full object-cover" />
                  ) : (
                    "Passport Photo"
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2"> {/* Buttons are stacked on mobile */}
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
                    className="w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-md text-sm font-semibold"
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCameraFor("passport")}
                    className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded-md text-sm font-semibold"
                  >
                    Use Camera
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-lg mb-6">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  ADDRESS AND CONTACT DETAILS
                </h2>
              </div>
              <div className="flex flex-wrap gap-x-4 sm:gap-x-12 gap-y-2 mb-4"> {/* Reduced gap on small screens */}
                {districts.map((district) => (
                  <label key={district} className="flex items-center">
                    <input
                      type="radio"
                      name="district"          // all radios must share the same name
                      value={district}         // the district value
                      checked={selectedDistrict === district}  // bind to state
                      onChange={() => setSelectedDistrict(district)}
                      className="mr-2"
                    />
                    {district}
                  </label>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Present residential address</label>
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

            <div className="bg-white/50 p-6 rounded-lg mb-6">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  NEXT OF KING
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700">Relationship</label>
                  <input type="text" name="kinRelationship" value={formData.kinRelationship} onChange={handleInputChange} className="w-full border-b border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700">First Name</label>
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

            <div className="bg-white/50 p-6 rounded-lg mb-6">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  MEDICAL - HEALTH DECLEARATION
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700">Do you have any special dietary needs?</label>
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"> {/* Stacks vertically on mobile */}
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
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"> {/* Stacks vertically on mobile */}
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
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4"> {/* Stacks vertically on mobile */}
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

            <div className="bg-white/50 p-6 rounded-lg mb-6">
              <div className="bg-gray-200 p-3 px-5 rounded-lg font-semibold text-gray-900 border-l-4 border-blue-500 mb-6">
                <h2 className="text-xl font-semibold">
                  DECLARATION
                </h2>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center"> {/* Stacks vertically on mobile */}
                  <label className="text-gray-700 mb-2 md:mb-0 mr-4">Have you ever been convicted?</label>
                  <div className="flex space-x-4">
                    <label><input type="radio" name="convicted" value="Yes" checked={formData.convicted === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
                    <label><input type="radio" name="convicted" value="No" checked={formData.convicted === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
                  </div>
                  {formData.convicted === "Yes" && (
                    <input type="text" placeholder="If Yes, when was the last time?" className="w-full ml-0 md:ml-4 border-b border-gray-400 focus:outline-none" />
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center"> {/* Stacks vertically on mobile */}
                  <label className="text-gray-700 mb-2 md:mb-0 mr-4">Have you ever been deported from Saudi Arabia?</label>
                  <div className="flex space-x-4">
                    <label><input type="radio" name="deported" value="Yes" checked={formData.deported === "Yes"} onChange={handleInputChange} className="mr-1" /> Yes</label>
                    <label><input type="radio" name="deported" value="No" checked={formData.deported === "No"} onChange={handleInputChange} className="mr-1" /> No</label>
                  </div>
                  {formData.deported === "Yes" && (
                    <input type="text" placeholder="If Yes, when?" className="w-full ml-0 md:ml-4 border-b border-gray-400 focus:outline-none" />
                  )}
                </div>
              </div>
              <p className="italic text-sm text-gray-600 mb-6">
                I hereby confirm that the information I have provided is true to the best of my knowledge.
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-end mt-8"> {/* Stacks vertically on mobile */}
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

            <div className=" bg-gray-100 px-4 py-1 rounded-full text-sm font-semibold text-blue-800 text-center">
              FOR OFFICIAL USE ONLY
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-6"> {/* Stacks vertically on mobile */}
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
              <div className="flex-grow mx-0 sm:mx-10 border-b-2 border-dashed border-gray-400"></div>
              <div className="flex flex-col items-start w-full sm:w-1/3">
                <div className="flex items-center space-x-2 mb-4">
                  <p className="text-sm">SLHS No</p>
                  <input type="text" className="w-full border-b border-gray-400" />
                </div>
                <div className="flex items-center space-x-2 w-full">
                  <p className="text-sm">Date</p>
                  <input type="date" className="w-full border-b border-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {showCameraFor && (
          <CameraCapture
            setPhoto={(data) => {
              if (showCameraFor === "pilgrim") {
                setFormData(prevData => ({ ...prevData, pilgrimPhoto: data }));
              } else if (showCameraFor === "passport") {
                setFormData(prevData => ({ ...prevData, passportPhoto: data }));
              }
            }}
            onClose={() => setShowCameraFor(null)}
          />
        )}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>

  );
};

export default HajjForm;