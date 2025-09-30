import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HajjApplicantsReport = () => {
    const [applicationYear, setApplicationYear] = useState(new Date().getFullYear().toString());
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data (using the slh6 sort logic from the previous step)
    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, "hajjApplicants"),
                where("applicationYear", "==", applicationYear)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Sort the data by the 'slh6' field numerically (ascending order)
            const sortedData = data.sort((a, b) => {
                const slh6A = a.slh6 || '999999999';
                const slh6B = b.slh6 || '999999999';

                const numA = parseInt(slh6A, 10);
                const numB = parseInt(slh6B, 10);

                const isNumA = !isNaN(numA);
                const isNumB = !isNaN(numB);

                if (isNumA && isNumB) {
                    return numA - numB;
                } else if (isNumA) {
                    return -1; 
                } else if (isNumB) {
                    return 1;
                }
                
                return slh6A.localeCompare(slh6B);
            });

            setApplicants(sortedData);

        } catch (error) {
            console.error("Error fetching applicants:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [applicationYear]);
    
    // Utility function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // --- NEW EXPORT FUNCTION: CSV (Excel Compatible) ---
    const exportToExcel = () => {
        if (applicants.length === 0) {
            alert("No data to export.");
            return;
        }

        // 1. Define the CSV header based on the table columns
        const headers = [
            "SLH6", "Last Name", "First Name", "Gender", "DOB", 
            "Passport No.", "Issue Date", "Expiry Date", "Phone", "Application Year"
        ];
        
        // 2. Map the data to CSV rows
        const csvRows = applicants.map(a => {
            // A helper to handle values that might contain commas or newlines by wrapping them in quotes
            const escapeField = (field) => {
                if (field === null || field === undefined) return '';
                let str = String(field);
                if (str.includes(',') || str.includes('\n') || str.includes('"')) {
                    // Escape internal double quotes by doubling them, then wrap the whole string in quotes
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            return [
                escapeField(a.slh6 || ''),
                escapeField(a.lastName || ''),
                escapeField(a.firstName || ''),
                escapeField(a.gender || ''),
                escapeField(formatDate(a.dob)),
                escapeField(a.passportNumber || ''),
                escapeField(formatDate(a.passportIssueDate)),
                escapeField(formatDate(a.passportExpiryDate)),
                escapeField(a.phone || ''),
                escapeField(a.applicationYear || ''),
            ].join(',');
        });

        // 3. Combine header and rows
        const csvString = [
            headers.join(','),
            ...csvRows
        ].join('\n');

        // 4. Create a hidden temporary link and trigger download
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `HajjApplicants_Report_${applicationYear}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Existing PDF function
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Hajj Applicants Report - ${applicationYear}`, 14, 20);

        doc.setFontSize(12);
        doc.text(`Total Applicants: ${applicants.length}`, 14, 30);

        // Include slh6 in the PDF table
        const tableData = applicants.map((a) => [
            a.slh6 || "", // NEW: slh6
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
            head: [["SLH6", "Last Name", "First Name", "Gender", "DOB", "Passport No.", "Issue Date", "Expiry Date"]], // NEW: SLH6 Header
            body: tableData,
            headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
            styles: { fontSize: 10, cellPadding: 3 },
        });

        doc.save(`HajjApplicants_${applicationYear}.pdf`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Hajj Applicants Report</h2>

            <div className="mb-4 flex items-center space-x-4">
                <label className="text-gray-700 font-semibold">Application Year:</label>
                <input
                    type="number"
                    value={applicationYear}
                    onChange={(e) => setApplicationYear(e.target.value)}
                    className="border px-3 py-2 rounded-md w-32"
                />
            </div>

            <p className="mb-4 font-medium text-gray-800">
                Total Applicants: {loading ? "Loading..." : applicants.length}
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                             {/* NEW COLUMN: SLH6 */}
                            <th className="px-4 py-2 text-left">SLH6</th> 
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
                                     {/* NEW COLUMN DATA: slh6 */}
                                    <td className="px-4 py-2 font-semibold">{a.slh6}</td>
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
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No applicants found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                {/* NEW EXPORT BUTTON */}
                <button
                    onClick={exportToExcel}
                    className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
                >
                    Export to Excel (CSV)
                </button>
                
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