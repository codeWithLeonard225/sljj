import React, { useState, useRef, useEffect } from "react";

/* --- Camera Capture Component --- */
const CameraCapture = ({ setPhoto, onClose, facingMode }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        // Implement a visual message to the user instead of an alert
        alert("Camera access was denied. Please check your browser settings.");
        onClose();
      }
    };
    startCamera();

    // Clean up function to stop the camera stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [facingMode, onClose]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setPhoto(imageData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold text-center mb-2">
          {facingMode === "user" ? "Pilgrim Photo" : "Passport Photo"}
        </h3>
        <video ref={videoRef} autoPlay className="w-full h-auto rounded-md mb-4" />
        <canvas ref={canvasRef} hidden />
        <div className="flex justify-around">
          <button
            onClick={capturePhoto}
            className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            Capture
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- Main Form Component --- */
const HajjForm = () => {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [pilgrimPhoto, setPilgrimPhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [showCameraFor, setShowCameraFor] = useState(null);

  const handleDobChange = (e) => {
    const birthDate = new Date(e.target.value);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setDob(e.target.value);
    setAge(calculatedAge >= 0 ? calculatedAge.toString() : "");
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

  const districts = [
    "Bo",
    "Bonthe",
    "Falaba",
    "Kailahun",
    "Kambia",
    "Kenema",
    "Kono",
    "Moyamba",
    "Portloko",
    "Pujehun",
    "Tonkolili",
    "W. Urban",
    "W. Rural",
    "Koinadugu",
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-xl">
        {/* --- Header Section --- */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img
              src="https://placehold.co/96x96/FFFFFF/000000?text=SL+COA"
              alt="Sierra Leone Coat of Arms"
              className="h-24 w-24 rounded-full"
            />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">GOVERNMENT OF SIERRA LEONE</h1>
          <h2 className="text-md sm:text-xl font-semibold">
            PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT
          </h2>
          <p className="text-xs sm:text-sm mt-2 text-gray-600">
            Old Gym House, Bank of Sierra Leone Complex, Kingtom, Freetown
          </p>
          <h1 className="text-lg sm:text-2xl font-bold mt-8 text-blue-800">
            HAJJ 2025 APPLICATION FORM
          </h1>
        </header>

        <form className="space-y-6">
          {/* --- Pilgrim Personal Info --- */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-md sm:text-lg font-bold text-blue-800 mb-4">
              PILGRIM'S PERSONAL INFORMATION{" "}
              <span className="text-xs font-normal italic text-gray-600">
                (AS PER NATIONAL PASSPORT)
              </span>
            </h2>

            {/* DOB + Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Age</label>
                <input
                  type="text"
                  value={age}
                  readOnly
                  className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Pilgrim Photo */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 font-semibold mb-2">Pilgrim Photo</label>
              <div className="border-2 border-dashed border-gray-300 w-36 h-48 flex items-center justify-center text-xs text-gray-500 mb-4 overflow-hidden rounded-md bg-gray-50">
                {pilgrimPhoto ? (
                  <img
                    src={pilgrimPhoto}
                    alt="Pilgrim"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "2-inch Photo"
                )}
              </div>
              <div className="flex space-x-2">
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
                  className="w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-300 hover:bg-blue-600 shadow-md"
                >
                  Upload File / Take Photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowCameraFor("pilgrim")}
                  className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-300 hover:bg-green-700 shadow-md"
                >
                  Use Camera
                </button>
              </div>
            </div>
          </div>

          {/* --- Passport Info --- */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-md sm:text-lg font-bold text-blue-800 mb-4">
              PASSPORT INFORMATION
            </h2>

            {/* Passport Photo */}
            <div className="flex flex-col items-center">
              <label className="block text-gray-700 font-semibold mb-2">Passport Photo</label>
              <div className="border-2 border-dashed border-gray-300 w-36 h-48 flex items-center justify-center text-xs text-gray-500 mb-4 overflow-hidden rounded-md bg-gray-50">
                {passportPhoto ? (
                  <img
                    src={passportPhoto}
                    alt="Passport"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Passport Photo"
                )}
              </div>
              <div className="flex space-x-2">
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
                  className="w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-300 hover:bg-blue-600 shadow-md"
                >
                  Upload File / Take Photo
                </button>
                <button
                  type="button"
                  onClick={() => setShowCameraFor("passport")}
                  className="w-full sm:w-auto bg-green-600 text-white py-2 px-6 rounded-md text-sm font-semibold transition duration-300 hover:bg-green-700 shadow-md"
                >
                  Use Camera
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Camera Modal */}
      {showCameraFor && (
        <CameraCapture
          setPhoto={
            showCameraFor === "pilgrim" ? setPilgrimPhoto : setPassportPhoto
          }
          facingMode={showCameraFor === "pilgrim" ? "user" : "environment"}
          onClose={() => setShowCameraFor(null)}
        />
      )}
    </div>
  );
};

const App = () => {
  return <HajjForm />;
};

export default App;
