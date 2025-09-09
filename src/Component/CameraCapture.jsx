import React, { useRef, useEffect, useState } from "react";

const CameraCapture = ({ setPhoto, onClose, initialFacingMode }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState(initialFacingMode);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Camera access was denied or no camera found.");
        onClose();
      }
    };

    startCamera();

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

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold text-center mb-2">
          {facingMode === "user" ? "Front Camera" : "Back Camera"}
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
            onClick={toggleCamera}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md font-semibold"
          >
            Switch Camera
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

export default CameraCapture;
