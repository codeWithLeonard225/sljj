import React, { useState, useEffect, useMemo, useCallback } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase"; // adjust path as needed

import { initialFormData } from "./utils/initialFormData";
import { calculateAgeFromDob } from "./utils/hajjHelpers";

import PersonalInformation from "./components/PersonalInformation";
import PassportInformation from "./components/PassportInformation";
import AddressInformation from "./components/AddressInformation";
import NextOfKin from "./components/NextOfKin";
import MedicalDeclaration from "./components/MedicalDeclaration";
import OfficialDeclaration from "./components/OfficialDeclaration";
import ApplicantTable from "./components/ApplicantTable";

const HajjForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [showCameraFor, setShowCameraFor] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [submissions, setSubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounce search input to prevent UI freezing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDobChange = useCallback((e) => {
    const dobValue = e.target.value;
    const ageValue = calculateAgeFromDob(dobValue);
    setFormData((prev) => ({
      ...prev,
      dob: dobValue,
      age: ageValue,
    }));
  }, []);

  const fetchSubmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
      const getFullName = (docData) => {
        const first = docData.firstName || "";
        const middle = docData.middleName || "";
        const last = docData.lastName || "";
        const concatenatedFirstName = middle.trim() ? `${first} ${middle}` : first;
        return {
          ...docData,
          concatenatedFirstName: concatenatedFirstName.trim(),
          fullName: `${concatenatedFirstName} ${last}`.trim(),
        };
      };

      const data = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...getFullName(d.data()),
      }));

      const sortedData = data.sort((a, b) => {
        const slh6A = a.slh6 || "999999999";
        const slh6B = b.slh6 || "999999999";
        const numA = parseInt(slh6A, 10);
        const numB = parseInt(slh6B, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return slh6A.localeCompare(slh6B);
      });

      setSubmissions(sortedData);
    } catch (error) {
      console.error("Error fetching submissions: ", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSelectedDistrict("");
    setEditingId(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "firstName", "lastName", "gender", "dob", "passportNumber",
      "passportIssuePlace", "passportIssueDate", "passportExpiryDate",
      "residentialAddress", "phone", "kinFirstName", "kinRelationship",
      "kinPhone", "applicationYear", "slh6"
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      alert(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
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

  const handleEdit = useCallback((submission) => {
    setFormData(submission);
    setEditingId(submission.id);
    setSelectedDistrict(submission.districts?.[0] || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(async (id) => {
    const DELETE_PASSWORD = "1718";
    const password = prompt("Enter password to delete this application:");
    if (password !== DELETE_PASSWORD) {
      alert("Incorrect password. Deletion canceled!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteDoc(doc(db, "hajjApplicants", id));
        alert("Application deleted successfully!");
        await fetchSubmissions();
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Error deleting application. Please try again.");
      }
    }
  }, []);

  const handlePrint = useCallback((submissionData) => {
    const getVal = (key) => submissionData[key] || 'N/A';

    const getFullName = () => {
      const first = submissionData.firstName || '';
      const middle = submissionData.middleName ? ` ${submissionData.middleName}` : '';
      const last = submissionData.lastName || '';
      return `${first}${middle} ${last}`.trim();
    };

    const pilgrimPhotoHtml = submissionData.pilgrimPhoto
      ? `<img src="${submissionData.pilgrimPhoto}" alt="Pilgrim Photo" style="width: 1.5in; height: 2in; object-fit: cover; border: 2px solid #ccc; margin-bottom: 5px; -webkit-print-color-adjust: exact; print-color-adjust: exact;" />`
      : `<div style="width: 1.5in; height: 2in; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; text-align: center; color: #555;">2-Inch Photo Missing</div>`;

    const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hajj Application - ${getVal('firstName')} ${getVal('lastName')}</title>
        <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; font-size: 10pt; }
            .background-wrapper {
                background-image: url('/images/needed.png');
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain; 
                min-height: 270mm;
                width: 100%;
                margin: 0;
                opacity: 0.15;
                position: absolute;
                top: 0; left: 0; z-index: -1;
            }
            .print-container { max-width: 190mm; margin: 0 auto; padding: 0; position: relative; z-index: 10; }
            .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #000; }
            .section-title { font-size: 11pt; font-weight: bold; background-color: #f3f4f6; padding: 5px 10px; margin-top: 15px; margin-bottom: 8px; border-left: 5px solid #3b82f6; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 15px; margin-bottom: 10px; }
            .info-item { font-size: 10pt; line-height: 1.4; padding-bottom: 3px; }
            .info-item strong { font-weight: bold; color: #555; min-width: 120px; }
            .signature-box { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 15px; border-top: 1px solid #ccc; }
            .signature-line { width: 100%; border-bottom: 1px solid #000; height: 15px; }
            .section-block { page-break-inside: avoid; break-inside: avoid; }
            .header img { cursor: pointer; }
            @media print {
                .background-wrapper { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                .info-grid { grid-template-columns: 1fr 1fr; }
                .info-item, .section-title, p, h1, strong { color: #000 !important; }
                .header img { cursor: default; }
            }
        </style>
    </head>
    <body>
        <div class="background-wrapper"></div>
        <div class="print-container">
            <div class="header section-block">
                <img src="/images/s-l1200.jpg" alt="SL Coat of Arms" style="height: 60px; margin-bottom: 5px;" onclick="window.close();" />
                <h1 style="font-size: 14pt; margin: 0;">PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT</h1>
                <p style="font-size: 9pt; margin-top: 3px;">HAJJ 2026 APPLICATION SUMMARY</p>
            </div>
            
            <div class="section-block" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex-grow: 1;">
                    <div class="section-title">PILGRIM'S PERSONAL INFORMATION</div>
                    <div class="info-grid" style="grid-template-columns: repeat(3, 1fr);">
                        <div class="info-item"><strong>Full Name:</strong> ${getFullName()}</div>
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
                    <div class="info-item"><strong>SLH6:</strong> ${getVal('slh6')}</div>
                </div>
            </div>

            <div class="section-title section-block">PASSPORT & CONTACT DETAILS</div>
            <div class="info-grid section-block">
                <div class="info-item"><strong>Passport No:</strong> ${getVal('passportNumber')}</div>
                <div class="info-item"><strong>Issue Place/Date:</strong> ${getVal('passportIssuePlace')} / ${getVal('passportIssueDate')}</div>
                <div class="info-item"><strong>Expiry Date:</strong> ${getVal('passportExpiryDate')}</div>
                <div class="info-item"><strong>District:</strong> ${(submissionData.districts || []).join(', ') || 'N/A'}</div>
                <div class="info-item" style="grid-column: span 2;"><strong>Residential Address:</strong> ${getVal('residentialAddress')}</div>
                <div class="info-item"><strong>Email:</strong> ${getVal('email')}</div>
                <div class="info-item"><strong>Phone:</strong> ${getVal('phone')}</div>
            </div>

            <div class="section-title section-block">NEXT OF KIN</div>
            <div class="info-grid section-block">
                <div class="info-item"><strong>Full Name:</strong> ${getVal('kinFirstName')}</div>
                <div class="info-item"><strong>Relationship:</strong> ${getVal('kinRelationship')}</div>
                <div class="info-item" style="grid-column: span 2;"><strong>Address:</strong> ${getVal('kinAddress')}</div>
                <div class="info-item"><strong>Phone:</strong> ${getVal('kinPhone')}</div>
                <div class="info-item"><strong>Email:</strong> ${getVal('kinEmail')}</div>
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

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const fullName = `${sub.concatenatedFirstName || ""} ${sub.lastName || ""}`.toLowerCase();
      const districtText = Array.isArray(sub.districts) ? sub.districts.join(", ").toLowerCase() : "";
      const passportNumber = (sub.passportNumber || "").toLowerCase();
      const phoneNumber = (sub.phone || "").toLowerCase();
      const applicationYear = (sub.applicationYear || "").toString();

      const search = debouncedSearch.toLowerCase();
      const matchesSearch =
        fullName.includes(search) ||
        districtText.includes(search) ||
        passportNumber.includes(search) ||
        phoneNumber.includes(search);

      const matchesYear = selectedYear === "" || applicationYear === selectedYear;

      return matchesSearch && matchesYear;
    });
  }, [submissions, debouncedSearch, selectedYear]);

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden py-2 px-1 sm:px-4">
      <div className="w-full max-w-4xl mx-auto relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Watermark Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: "url('/images/needed.png')" }}
        />

        {/* Form Wrap */}
        <form onSubmit={handleSubmit} className="relative z-10 p-3 sm:p-6 md:p-8">
          
          <header className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center items-center mb-3">
              <img
                src="/images/s-l1200.jpg"
                alt="Sierra Leone Coat of Arms"
                className="h-16 sm:h-24 w-auto object-contain"
              />
            </div>
            <h1 className="text-base sm:text-2xl font-bold tracking-tight text-gray-900">
              GOVERNMENT OF SIERRA LEONE
            </h1>
            <h2 className="text-sm sm:text-xl font-semibold text-gray-800 mt-1">
              PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT
            </h2>
            <p className="text-xs sm:text-sm mt-1 text-gray-600">
              Old Gym House, Bank of Sierra Leone Complex, Kingtom, Freetown
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 break-words mt-1">
              Tel: +23273292929 | Email: info@sierraleonehajj.org | Website: www.sierraleonehajj.org
            </p>
            <hr className="my-4 border-gray-300" />
            <h1 className="text-lg sm:text-2xl font-bold mt-4 text-blue-800 uppercase tracking-wide">
              HAJJ 2027 APPLICATION FORM
            </h1>
          </header>

          <div className="mb-6 bg-white/60 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Application Year
            </label>
            <input
              type="number"
              name="applicationYear"
              value={formData.applicationYear}
              onChange={handleInputChange}
              className="w-full sm:w-1/2 border-b border-gray-400 focus:border-blue-600 focus:outline-none bg-transparent py-1 text-gray-800 font-medium"
            />
          </div>

          <PersonalInformation
            formData={formData}
            handleInputChange={handleInputChange}
            handleDobChange={handleDobChange}
            setShowCameraFor={setShowCameraFor}
            setFormData={setFormData}
          />

          <PassportInformation
            formData={formData}
            handleInputChange={handleInputChange}
            setShowCameraFor={setShowCameraFor}
            setFormData={setFormData}
          />

          <AddressInformation
            formData={formData}
            handleInputChange={handleInputChange}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />

          <NextOfKin
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <MedicalDeclaration
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <OfficialDeclaration
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-2.5 rounded-lg font-semibold text-sm transition shadow-sm"
            >
              {loading ? "Saving..." : editingId ? "Update Application" : "Submit Form"}
            </button>
          </div>

          {/* Applicant Table View Component */}
          <ApplicantTable
            submissions={filteredSubmissions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handlePrint={handlePrint}
            editingId={editingId}
          />
        </form>
      </div>
    </div>
  );
};

export default HajjForm;