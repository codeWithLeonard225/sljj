import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const HajjApplicantsReport = () => {
    const [applicationYear, setApplicationYear] = useState(new Date().getFullYear().toString());
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data
    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, "hajjApplicants"),
                where("applicationYear", "==", applicationYear)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setApplicants(data);
        } catch (error) {
            console.error("Error fetching applicants:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [applicationYear]);



    // Add this function inside your component
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" }); // "Jan", "Feb", etc.
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // e.g., 4/Feb/2025
    };



    // Generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Hajj Applicants Report - ${applicationYear}`, 14, 20);

        doc.setFontSize(12);
        doc.text(`Total Applicants: ${applicants.length}`, 14, 30);

        const tableData = applicants.map((a) => [
            a.lastName || "",
            a.firstName || "",
            a.gender || "",
            formatDate(a.dob),
            a.passportNumber || "",
            formatDate(a.passportIssueDate),
            formatDate(a.passportExpiryDate),
        ]);


        autoTable(doc, {
            startY: 40,
            head: [["Last Name", "First Name", "Gender", "DOB", "Passport No.", "Issue Date", "Expiry Date"]],
            body: tableData,
            headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
            styles: { fontSize: 10, cellPadding: 3 },
        });



        doc.save(`HajjApplicants_${applicationYear}.pdf`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Hajj Applicants Report</h2>

            {/* Filter by Application Year */}
            <div className="mb-4 flex items-center space-x-4">
                <label className="text-gray-700 font-semibold">Application Year:</label>
                <input
                    type="number"
                    value={applicationYear}
                    onChange={(e) => setApplicationYear(e.target.value)}
                    className="border px-3 py-2 rounded-md w-32"
                />
                <button
                    onClick={fetchApplicants}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Filter
                </button>
            </div>

            {/* Count */}
            <p className="mb-4 font-medium text-gray-800">
                Total Applicants: {loading ? "Loading..." : applicants.length}
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Last Name</th>
                            <th className="px-4 py-2 text-left">First Name</th>
                            <th className="px-4 py-2 text-left">Gender</th>
                            <th className="px-4 py-2 text-left">DOB</th>
                            <th className="px-4 py-2 text-left">Passport No.</th>
                            <th className="px-4 py-2 text-left">Issue Date</th>
                            <th className="px-4 py-2 text-left">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.length > 0 ? (
                            applicants.map((a) => (
                                <tr key={a.id} className="border-t">
                                    <td className="px-4 py-2">{a.lastName}</td>
                                    <td className="px-4 py-2">{a.firstName}</td>
                                    <td className="px-4 py-2">{a.gender}</td>
                                    <td className="px-4 py-2">{formatDate(a.dob)}</td>
                                    <td className="px-4 py-2">{a.passportNumber}</td>
                                    <td className="px-4 py-2">{formatDate(a.passportIssueDate)}</td>
                                    <td className="px-4 py-2">{formatDate(a.passportExpiryDate)}</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">
                                    No applicants found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Print Button */}
            <div className="mt-6 text-right">
                <button
                    onClick={generatePDF}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                >
                    Print as PDF
                </button>
            </div>
        </div>
    );
};

export default HajjApplicantsReport;
