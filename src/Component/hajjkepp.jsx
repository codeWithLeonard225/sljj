import React, { useState, useEffect } from "react";
import CameraCapture from "./CameraCapture";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed

const HajjForm = () => {


    const initialFormData = {
        applicationYear: "",
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
    };
    const [formData, setFormData] = useState(initialFormData);
    const [showCameraFor, setShowCameraFor] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState("");


    const districts = [
        'Bo', 'Bonthe', 'Falaba', 'Kailahun', 'Kambia', 'Kenema', 'Kono', 'Moyamba',
        'Portloko', 'Pujehun', 'Tonkolili', 'W. Urban', 'W. Rural', 'Koinadugu'
    ];

    // State for the table data
    const [submissions, setSubmissions] = useState([]);
    // State to track if we are editing a submission (holds the Firebase document ID)
    const [editingId, setEditingId] = useState(null);




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

    const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
  e.preventDefault();

  // Required fields for validation
  const requiredFields = [
    "firstName",
    "lastName",
    // "gender",
    // "dob",
    // "passportNumber",
    // "passportIssuePlace",
    // "passportIssueDate",
    // "passportExpiryDate",
    // "residentialAddress",
    // "phone",
    // "kinFirstName",
    // "kinRelationship",
    // "kinPhone",
    // "pilgrimPhoto",  
    // "passportPhoto",  
    // "applicationYear",
  ];

  // Validation check
  const missingFields = requiredFields.filter(
    (field) => !formData[field] || formData[field].toString().trim() === ""
  );

  if (missingFields.length > 0) {
    alert(`Please fill all required fields: ${missingFields.join(", ")}`);
    return; // stop form submission
  }

  const dataToSave = {
    ...formData,
    districts: selectedDistrict ? [selectedDistrict] : formData.districts,
    submittedAt: new Date().toISOString(),
  };

  setLoading(true);

  try {
    if (editingId) {
      const docRef = doc(db, "hajjApplicants", editingId);
      await updateDoc(docRef, dataToSave);
      alert("Application updated successfully!");
    } else {
      await addDoc(collection(db, "hajjApplicants"), dataToSave);
      alert("Form submitted successfully!");
    }

    await fetchSubmissions();
    resetForm();
  } catch (error) {
    console.error(`Error ${editingId ? "updating" : "adding"} document: `, error);
    alert(`Error ${editingId ? "updating" : "submitting"} form. Please try again.`);
  } finally {
    setLoading(false);
  }
};


    const fetchSubmissions = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort to show the latest at the top
            setSubmissions(data.reverse());
        } catch (error) {
            console.error("Error fetching submissions: ", error);
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchSubmissions();
    }, []);

    const resetForm = () => {
        // Replaced the hardcoded reset with initialFormData
        setFormData(initialFormData);
        setSelectedDistrict("");
        setEditingId(null);
    }

    const handleEdit = (submission) => {
        // Load the submission data into the form for editing
        setFormData(submission);
        // Set the editing ID
        setEditingId(submission.id);
        // Set the radio button district
        setSelectedDistrict(submission.districts?.[0] || ""); // Use optional chaining for safety
        // Scroll to the top of the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

 const DELETE_PASSWORD = "1718"; // change this to your preferred password

const handleDelete = async (id) => {
  const password = prompt("Enter password to delete this application:");

  if (password !== DELETE_PASSWORD) {
    alert("Incorrect password. Deletion canceled!");
    return;
  }

  if (window.confirm("Are you sure you want to delete this application?")) {
    try {
      await deleteDoc(doc(db, "hajjApplicants", id));
      alert("Application deleted successfully!");
      // Refresh the list
      await fetchSubmissions();
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Error deleting application. Please try again.");
    }
  }
};


    const handlePrint = (submissionData) => {
        // Helper function to safely get data or a placeholder
        const getVal = (key) => submissionData[key] || 'N/A';

        // Format the Photo URL for printing (or use a placeholder)
        // Photo is embedded as a Base64 string from the form data
        const pilgrimPhotoHtml = submissionData.pilgrimPhoto
            ? `<img src="${submissionData.pilgrimPhoto}" alt="Pilgrim Photo" style="width: 1.5in; height: 2in; object-fit: cover; border: 2px solid #ccc; margin-bottom: 5px; -webkit-print-color-adjust: exact; print-color-adjust: exact;" />`
            : `<div style="width: 1.5in; height: 2in; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; text-align: center; color: #555;">2-Inch Photo Missing</div>`;

        // Generate print-friendly HTML content using the submissionData
        const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hajj Application - ${getVal('firstName')} ${getVal('lastName')}</title>
        <style>
            /* PAGE SETUP */
            @page { 
                size: A4; 
                margin: 10mm; /* Minimal margins */
            }
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                color: #000; 
                font-size: 10pt;
            }
            
            /* BACKGROUND WRAPPER (Watermark) */
            .background-wrapper {
                background-image: url('/images/needed.png');
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain; 
                min-height: 270mm; /* Ensures it covers the full page height */
                width: 100%;
                padding: 0;
                margin: 0;
                opacity: 0.15; /* Light watermark opacity */
                position: absolute; /* Allows content to float over it */
                top: 0;
                left: 0;
                z-index: -1; /* Pushes it behind the content */
            }
            
            .print-container { 
                max-width: 190mm; /* A little less than A4 width */
                margin: 0 auto; 
                padding: 0;
                position: relative;
                z-index: 10;
            }

            /* TYPOGRAPHY & LAYOUT */
            .header { 
                text-align: center; 
                margin-bottom: 20px; 
                padding-bottom: 10px; 
                border-bottom: 2px solid #000; 
            }
            .section-title { 
                font-size: 11pt; 
                font-weight: bold; 
                background-color: #f3f4f6; 
                padding: 5px 10px; 
                margin-top: 15px; 
                margin-bottom: 8px;
                border-left: 5px solid #3b82f6; 
            }
            .info-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 5px 15px; /* Reduced gap */
                margin-bottom: 10px; 
            }
            .info-item { 
                font-size: 10pt; 
                line-height: 1.4;
                padding-bottom: 3px;
            }
            .info-item strong { 
                display: inline-block; 
                font-weight: bold; 
                color: #555; 
                min-width: 120px;
            }
            .signature-box { 
                display: flex; 
                justify-content: space-between; 
                margin-top: 40px; 
                padding-top: 15px; 
                border-top: 1px solid #ccc; 
            }
            .signature-line { 
                width: 100%; 
                border-bottom: 1px solid #000; 
                height: 15px; /* Reduced height */
            }
            
            /* CRITICAL: Ensure content breaks cleanly */
            .section-block { 
                page-break-inside: avoid; 
                break-inside: avoid; 
            }
            
            /* Add pointer cursor to the image */
            .header img {
                cursor: pointer;
            }

            /* PRINT OVERRIDE */
            @media print {
                /* CRITICAL: Force backgrounds to print for the watermark */
                .background-wrapper {
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important;
                }
                .info-grid { grid-template-columns: 1fr 1fr; }
                /* Make all text black for clean printing */
                .info-item, .section-title, p, h1, strong {
                    color: #000 !important;
                }
                /* Remove pointer cursor for the printout */
                .header img {
                    cursor: default;
                }
            }
        </style>
    </head>
    <body>
        <div class="background-wrapper"></div>
        
        <div class="print-container">

            <div class="header section-block">
                <!-- ADDED THE ONCLICK HERE -->
                <img src="/images/s-l1200.jpg" alt="SL Coat of Arms" style="height: 60px; margin-bottom: 5px;" onclick="window.close();" />
                <h1 style="font-size: 14pt; margin: 0;">PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT</h1>
                <p style="font-size: 9pt; margin-top: 3px;">HAJJ 2026 APPLICATION SUMMARY</p>
            </div>
            
            <div class="section-block" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex-grow: 1;">
                    <div class="section-title">PILGRIM'S PERSONAL INFORMATION</div>
                    <div class="info-grid" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="info-item"><strong>Full Name:</strong> ${getVal('firstName')} ${getVal('middleName')} ${getVal('lastName')}</div>
                        <div class="info-item"><strong>Marital Status:</strong> ${getVal('maritalStatus')}</div>
                        <div class="info-item"><strong>Gender:</strong> ${getVal('gender')}</div>
                        <div class="info-item"><strong>DOB / Age:</strong> ${getVal('dob')} / ${getVal('age')}</div>
                        <div class="info-item"><strong>Occupation:</strong> ${getVal('occupation')}</div>
                        <div class="info-item"><strong>Hajj Before:</strong> ${getVal('hajjBefore')} ${getVal('hajjBefore') === 'Yes' ? `(${getVal('hajjYear')})` : ''}</div>
                    </div>
                </div>
                <div style="width: 1.5in; margin-left: 20px; text-align: center; flex-shrink: 0;">
                    ${pilgrimPhotoHtml}
                    <p style="font-size: 8pt; margin: 0;">Pilgrim Photo</p>
                </div>
            </div>

            <div class="section-title section-block">PASSPORT & CONTACT DETAILS</div>
            <div class="info-grid section-block">
                <div class="info-item"><strong>Passport No:</strong> ${getVal('passportNumber')}</div>
                <div class="info-item"><strong>Issue Place/Date:</strong> ${getVal('passportIssuePlace')} / ${getVal('passportIssueDate')}</div>
                <div class="info-item"><strong>Expiry Date:</strong> ${getVal('passportExpiryDate')}</div>
                <div class="info-item"><strong>District:</strong> ${submissionData.districts?.join(', ') || 'N/A'}</div>
                <div class="info-item" style="grid-column: span 2;"><strong>Residential Address:</strong> ${getVal('residentialAddress')}</div>
                <div class="info-item"><strong>Email:</strong> ${getVal('email')}</div>
                <div class="info-item"><strong>Phone:</strong> ${getVal('phone')}</div>
            </div>

            <div class="section-title section-block">NEXT OF KIN</div>
            <div class="info-grid section-block">
                <div class="info-item"><strong>Kin Name:</strong> ${getVal('kinFirstName')}</div>
                <div class="info-item"><strong>Relationship:</strong> ${getVal('kinRelationship')}</div>
                <div class="info-item" style="grid-column: span 2;"><strong>Kin Address:</strong> ${getVal('kinAddress')}</div>
                <div class="info-item"><strong>Kin Phone:</strong> ${getVal('kinPhone')}</div>
                <div class="info-item"><strong>Kin Email:</strong> ${getVal('kinEmail')}</div>
            </div>

            <div class="section-title section-block">HEALTH & LEGAL DECLARATION</div>
            <div class="info-grid section-block">
                <div class="info-item"><strong>Diet Needs:</strong> ${getVal('dietNeeds')} ${getVal('dietNeeds') === 'Yes' ? `(${getVal('dietDetails')})` : ''}</div>
                <div class="info-item"><strong>Medical Condition:</strong> ${getVal('medicalCondition')} ${getVal('medicalCondition') === 'Yes' ? `(${getVal('medicalDetails')})` : ''}</div>
                <div class="info-item"><strong>COVID Vaccine:</strong> ${getVal('covidVaccine')} ${getVal('covidVaccine') === 'Yes' ? `(${getVal('covidVaccineName')})` : ''}</div>
                <div class="info-item"><strong>Vaccine Date:</strong> ${getVal('vaccineDate')}</div>
                <div class="info-item"><strong>Convicted:</strong> ${getVal('convicted')}</div>
                <div class="info-item"><strong>Deported:</strong> ${getVal('deported')}</div>
            </div>

            <div class="signature-box section-block">
                <div style="width: 45%; text-align: center;">
                    <div class="signature-line"></div>
                    <p style="font-size: 8pt; margin-top: 5px;">Pilgrim's Signature / Thumb Print</p>
                </div>
                <div style="width: 45%; text-align: center;">
                    <div class="signature-line"></div>
                    <p style="font-size: 8pt; margin-top: 5px;">Date Printed: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <p style="font-size: 7pt; text-align: center; margin-top: 15px;">I hereby confirm that the information provided is true to the best of my knowledge.</p>
            <p style="font-size: 8pt; text-align: center; margin-top: 5px; color: #555;">*This is a summary of the application data submitted to the Presidential Hajj Taskforce Secretariat.</p>
        </div>
    </body>
    </html>
`;

        // Open a new window, write the content, and trigger print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();

            // Use a slight delay to ensure the background image/CSS is parsed before printing
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }
    };

    return (
        <div className="w-full max-w-4xl min-h-screen flex justify-center items-center bg-gray-100 p-2 sm:p-4 hajj-form-wrapper">
            <form onSubmit={handleSubmit}>
                <div
                    className="min-h-screen flex justify-center items-start  bg-gray-100"
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
                                HAJJ 2026 APPLICATION FORM
                            </h1>
                        </header>
                        <div>
                            <label className="block text-gray-700">Application Year</label>
                            <input
                                type="number"
                                name="applicationYear"
                                value={formData.applicationYear}
                                onChange={handleInputChange}
                                className="w-full border-b border-gray-400 focus:outline-none"
                            />
                        </div>


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
                            {/* Date of Issue */}
                            <div>
                                <label className="block text-gray-700">Date of issue</label>
                                <input
                                    type="date"
                                    name="passportIssueDate"
                                    value={formData.passportIssueDate || ""}
                                    onChange={(e) => {
                                        handleInputChange(e);

                                        // Auto-calculate expiry date (5 years later)
                                        const issueDate = new Date(e.target.value);
                                        if (!isNaN(issueDate)) {
                                            const expiryDate = new Date(issueDate);
                                            expiryDate.setFullYear(expiryDate.getFullYear() + 5);

                                            setFormData((prev) => ({
                                                ...prev,
                                                passportExpiryDate: expiryDate.toISOString().split("T")[0], // format yyyy-mm-dd
                                            }));
                                        }
                                    }}
                                    className="w-full border-b border-gray-400 focus:outline-none"
                                />
                            </div>

                            {/* Date of Expiry */}
                            <div>
                                <label className="block text-gray-700">Date of expiry</label>
                                <input
                                    type="date"
                                    name="passportExpiryDate"
                                    value={formData.passportExpiryDate || ""}
                                    onChange={handleInputChange}
                                    className="w-full border-b border-gray-400 focus:outline-none"
                                    readOnly
                                />
                            </div>


                            <div className="flex flex-col items-center">
                                <label>Passport Book</label>
                                <div className="border-8 border-dashed w-60 h-48 flex items-center justify-center bg-white/30">
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
                <div className="flex justify-center mt-6 gap-4 p-4 bg-blue-50 rounded-lg shadow-inner">
                    {editingId ? (
                        <>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 rounded-md font-semibold shadow-lg transition ${loading
                                    ? "bg-green-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                            >
                                {loading ? "Updating..." : "Update Application"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={loading}
                                className="bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition shadow-lg"
                            >
                                Cancel Edit
                            </button>
                        </>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-3 rounded-md font-semibold shadow-lg transition ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Submitting..." : "Submit New Application"}
                        </button>
                    )}
                </div>
                <div className="w-full max-w-4xl mt-12 p-6 bg-white rounded-lg shadow-xl no-print table-container">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 pb-2 border-blue-500">
                        Submitted Applications
                    </h2>

                    {/* 1. DESKTOP TABLE VIEW (md: and up) */}
                    {/* This entire block is hidden on small screens and shown on medium screens and larger */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-medium">Name</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium">District</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium">Passport No.</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium">Phone</th>
                                    <th className="py-3 px-4 text-center text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.length > 0 ? (
                                    submissions.map((sub) => (
                                        <tr key={sub.id} className={`border-b ${editingId === sub.id ? 'bg-yellow-100' : 'hover:bg-gray-50'}`}>
                                            <td className="py-3 px-4 text-sm font-semibold">{`${sub.firstName} ${sub.lastName}`}</td>
                                            <td className="py-3 px-4 text-sm">{sub.districts.join(', ') || 'N/A'}</td>
                                            <td className="py-3 px-4 text-sm">{sub.passportNumber}</td>
                                            <td className="py-3 px-4 text-sm">{sub.phone}</td>
                                            <td className="py-3 px-4 text-center space-x-2 whitespace-nowrap">
                                                {/* Action Buttons */}
                                                <button type="button" onClick={() => handleEdit(sub)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-yellow-600 transition">Edit</button>
                                                <button type="button" onClick={() => handleDelete(sub.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition">Delete</button>
                                                <button type="button" onClick={() => handlePrint(sub)} className="bg-gray-700 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-gray-800 transition">Print</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-500">
                                            No applications submitted yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 2. MOBILE CARD VIEW (Below md:) */}
                    {/* This list is shown on small screens and hidden on medium screens and larger */}
                    <div className="md:hidden space-y-4">
                        {submissions.length > 0 ? (
                            submissions.map((sub) => (
                                <div
                                    key={sub.id}
                                    className={`p-4 border rounded-lg shadow-md ${editingId === sub.id ? 'bg-yellow-100 border-yellow-500' : 'bg-white border-gray-200'}`}
                                >
                                    {/* Header: Name and Passport */}
                                    <div className="flex justify-between items-start mb-2 border-b pb-2">
                                        <p className="text-lg font-bold text-blue-700">
                                            {`${sub.firstName} ${sub.lastName}`}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Passport:</span> {sub.passportNumber}
                                        </p>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1 text-sm mb-4">
                                        <p><strong>District:</strong> {sub.districts.join(', ') || 'N/A'}</p>
                                        <p><strong>Phone:</strong> {sub.phone}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-around space-x-2 pt-2 border-t border-dashed border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(sub)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-yellow-600 transition flex-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(sub.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition flex-1"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePrint(sub)}
                                            className="bg-gray-700 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-gray-800 transition flex-1"
                                        >
                                            Print
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="py-4 text-center text-gray-500">
                                No applications submitted yet.
                            </p>
                        )}
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        *Note: The **Edit** button loads the application data back into the form above. Click **Update Application** to save changes.
                    </div>
                </div>
            </form>
        </div>

    );
};

export default HajjForm;