import React, { useState } from "react";
import CameraCapture from "./CameraCapture";

const HajjForm = () => {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [pilgrimPhoto, setPilgrimPhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [showCameraFor, setShowCameraFor] = useState(null);

  const districts = [
    'Bo', 'Bonthe', 'Falaba', 'Kailahun', 'Kambia', 'Kenema', 'Kono', 'Moyamba',
    'Portloko', 'Pujehun', 'Tonkolili', 'W. Urban', 'W. Rural', 'Koinadugu'
  ];

  const handleDobChange = (e) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);

    if (selectedDob) {
      const birthDate = new Date(selectedDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 0 ? calculatedAge.toString() : '');
    } else {
      setAge('');
    }
  };

  const handlePhotoChange = (e, setPhoto) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhoto(null);
    }
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-8 flex justify-center"
      style={{
        backgroundImage: "url('/images/needed.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
    >
      {/* Form container with higher transparency and no shadow */}
      <div className="relative w-full max-w-6xl bg-white/60 p-6 sm:p-8 rounded-lg">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img
              src="/images/s-l1200.jpg"
              alt="Sierra Leone Coat of Arms"
              className="h-24"
            />
          </div>
          <h1 className="text-2xl font-bold">GOVERNMENT OF SIERRA LEONE</h1>
          <h2 className="text-xl font-semibold">PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT</h2>
          <p className="text-sm mt-2">
            Old Gym House, Bank of Sierra Leone Complex, Kingtom, Freetown
          </p>
          <p className="text-sm">
            Tel: +23273292929; Email: info@sierraleonehajj.org; Website: www.sierraleonehajj.org
          </p>
          <hr />
          <h1 className="text-2xl font-bold mt-8 text-blue-800">
            HAJJ 2025 APPLICATION FORM
          </h1>
        </header>

        {/* --- Pilgrim Personal Info Section --- */}
        <div className="bg-white/50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">
              PILGRIM'S PERSONAL INFORMATION{' '}
              <span className="text-sm font-normal italic text-gray-600">(AS PER NATIONAL PASSPORT)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <label className="mr-4 text-gray-700">Are you currently residing in Sierra Leone?</label>
                <div className="flex items-center space-x-4">
                  <label><input type="radio" name="residing" className="mr-1" /> Yes</label>
                  <label><input type="radio" name="residing" className="mr-1" /> No</label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">If No, where do you reside?</label>
              <div className="grid grid-cols-3">
                <div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" /> West Africa
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Europe
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-2" /> USA/Australia
                  </div>
                </div>
                <div>
                  <input type="text" placeholder="Country" className="border-b border-gray-400 focus:outline-none" />
                  <input type="text" placeholder="Agency" className="border-b border-gray-400 focus:outline-none" />
                  <input type="text" placeholder="State" className="border-b border-gray-400 focus:outline-none" />
                </div>
                <div>
                  <input type="text" placeholder="Country" className="border-b border-gray-400 focus:outline-none" />
                  <input type="text" placeholder="Agency" className="border-b border-gray-400 focus:outline-none" />
                  <input type="text" placeholder="State" className="border-b border-gray-400 focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="First Name" className="w-full border-b border-gray-400 focus:outline-none" />
              <input type="text" placeholder="Middle Name" className="w-full border-b border-gray-400 focus:outline-none" />
              <input type="text" placeholder="Last Name" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
            <div className="flex items-center space-x-8 mb-4">
              <label className="text-gray-700">Marital Status</label>
              <label><input type="radio" name="marital" className="mr-1" /> Single</label>
              <label><input type="radio" name="marital" className="mr-1" /> Married</label>
            </div>
            <div className="flex items-center space-x-8 mb-4">
              <label className="text-gray-700">Gender</label>
              <label><input type="radio" name="gender" className="mr-1" /> Male</label>
              <label><input type="radio" name="gender" className="mr-1" /> Female</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full border-b border-gray-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700">Age</label>
                <input type="text" value={age} readOnly className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Occupation</label>
              <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Local Language</label>
              <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
            <div className="flex items-center space-x-8 mb-4">
              <label className="text-gray-700">Have you performed Hajj before?</label>
              <label><input type="radio" name="hajj-before" className="mr-1" /> Yes</label>
              <label><input type="radio" name="hajj-before" className="mr-1" /> No</label>
              <input type="text" placeholder="If Yes, year(s)" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
          

          {/* Pilgrim Photo */}
          <div className="flex flex-col items-center mb-4">
            <label>Pilgrim Photo</label>
            <div className="border-8 border-dashed w-36 h-48 flex items-center justify-center bg-white/30">
              {pilgrimPhoto ? (
                <img src={pilgrimPhoto} alt="Pilgrim" className="w-full h-full object-cover" />
              ) : (
                "2-inch Photo"
              )}
            </div>
            <div className="flex space-x-2 mt-2">
              <input
                id="pilgrim-photo-input"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handlePhotoChange(e, setPilgrimPhoto)}
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

        {/* --- Passport Section --- */}
        <div className="bg-white/50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-bold text-blue-800 mb-4">PASSPORT INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">Passport Number</label>
              <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-gray-700">Place of issue</label>
              <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">Date of issue</label>
              <input type="date" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-gray-700">Date of expiry</label>
              <input type="date" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
          </div>

          {/* Passport Photo */}
          <div className="flex flex-col items-center">
            <label>Passport Book</label>
            <div className="border-8 border-dashed w-36 h-48 flex items-center justify-center bg-white/30">
              {passportPhoto ? (
                <img src={passportPhoto} alt="Passport" className="w-full h-full object-cover" />
              ) : (
                "Passport Photo"
              )}
            </div>
            <div className="flex space-x-2 mt-2">
              <input
                id="passport-photo-input"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handlePhotoChange(e, setPassportPhoto)}
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
               {/* --- Address and Contact Details Section --- */}
          <div className="bg-white/50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">ADDRESS AND CONTACT DETAILS</h2>
            <div className="flex flex-wrap gap-x-12 gap-y-2 mb-4">
              {districts.map((district) => (
                <div key={district} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="text-gray-700">{district}</label>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Present residential address</label>
              <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Other address (if any)</label>
                <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700">Email Address</label>
                <input type="email" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700">Phone Number(s)</label>
                <input type="tel" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
            </div>
          </div>
           {/* --- Next of Kin Section --- */}
          <div className="bg-white/50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">NEXT OF KIN</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Relationship</label>
                <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700">First Name</label>
                <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Address</label>
                <input type="text" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700">Phone Number(s)</label>
                <input type="tel" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input type="email" className="w-full border-b border-gray-400 focus:outline-none" />
            </div>
          </div>

          {/* --- Medical-Health Declaration Section --- */}
          <div className="bg-white/50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">MEDICAL- HEALTH DECLARATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Do you have any special dietary needs?</label>
                <div className="flex items-center space-x-4">
                  <label><input type="radio" name="diet" className="mr-1" /> Yes</label>
                  <label><input type="radio" name="diet" className="mr-1" /> No</label>
                  <input type="text" placeholder="If Yes, provide details" className="w-full border-b border-gray-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Do you have any medical condition(s)?</label>
                <div className="flex items-center space-x-4">
                  <label><input type="radio" name="medical" className="mr-1" /> Yes</label>
                  <label><input type="radio" name="medical" className="mr-1" /> No</label>
                  <input type="text" placeholder="If Yes, provide details" className="w-full border-b border-gray-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Have you taken covid vaccination(s)?</label>
                <div className="flex items-center space-x-4">
                  <label><input type="radio" name="covid" className="mr-1" /> Yes</label>
                  <label><input type="radio" name="covid" className="mr-1" /> No</label>
                  <input type="text" placeholder="If Yes, name of vaccine" className="w-full border-b border-gray-400 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Date</label>
                <input type="date" className="w-full border-b border-gray-400 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* --- Declaration Section --- */}
          <div className="bg-white/50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-4">DECLARATION</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <label className="text-gray-700 mr-4">Have you ever been convicted?</label>
                <label><input type="radio" name="convicted" className="mr-1" /> Yes</label>
                <label className="ml-4"><input type="radio" name="convicted" className="mr-1" /> No</label>
                <input type="text" placeholder="If Yes, when was the last time?" className="w-full ml-4 border-b border-gray-400 focus:outline-none" />
              </div>
              <div className="flex items-center">
                <label className="text-gray-700 mr-4">Have you ever been deported from Saudi Arabia?</label>
                <label><input type="radio" name="deported" className="mr-1" /> Yes</label>
                <label className="ml-4"><input type="radio" name="deported" className="mr-1" /> No</label>
                <input type="text" placeholder="If Yes, when?" className="w-full ml-4 border-b border-gray-400 focus:outline-none" />
              </div>
            </div>
            <p className="italic text-sm text-gray-600 mb-6">
              I hereby confirm that the information I have provided is true to the best of my knowledge.
            </p>
            <div className="flex justify-between items-center mt-8">
              <div className="w-1/2 mr-4">
                <div className="border-b border-black h-8 mb-2"></div>
                <p className="text-xs text-gray-500">Signature/Thumb Print</p>
              </div>
              <div className="w-1/2">
                <div className="border-b border-black h-8 mb-2"></div>
                <p className="text-xs text-gray-500">Date</p>
              </div>
            </div>
          </div>

          {/* --- Official Use Only Section --- */}

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white px-4 text-blue-800 font-bold">
            FOR OFFICIAL USE ONLY
          </div>
          <div className="flex justify-between items-end pt-6">
            <div className="flex flex-col space-y-2">
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
            <div className="flex-grow mx-10 border-b-2 border-dashed border-gray-400"></div>
            <div className="flex flex-col items-start w-1/3">
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

        {/* --- Camera Modal --- */}
        {showCameraFor && (
          <CameraCapture
            setPhoto={(data) => {
              if (showCameraFor === "pilgrim") setPilgrimPhoto(data);
              else if (showCameraFor === "passport") setPassportPhoto(data);
            }}
            initialFacingMode="user"
            onClose={() => setShowCameraFor(null)}
          />
        )}
      </div>
    </div>
  );
};

export default HajjForm;
