import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const PCodeReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPCodeRecords = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const allData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter for SLH6 starting with 'P' (case insensitive)
            const filtered = allData.filter(person => 
                person.slh6 && /^P/i.test(person.slh6)
            );

            // Numerical Sort (P1, P2, P10 instead of P1, P10, P2)
            const sorted = filtered.sort((a, b) => {
                const numA = parseInt(a.slh6.replace(/\D/g, ''), 10) || 0;
                const numB = parseInt(b.slh6.replace(/\D/g, ''), 10) || 0;
                return numA - numB;
            });

            setReportData(sorted);
        } catch (error) {
            console.error("Error fetching P-Series report:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPCodeRecords();
    }, []);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-5xl mx-auto bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-emerald-700 text-white p-6 flex justify-between items-center print:bg-white print:text-black print:border-b-2 print:border-black">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">P-SERIES APPLICANT REPORT</h1>
                        <p className="text-emerald-100 print:text-gray-600">Hajj 2026 Internal Records</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">Total Count</p>
                        <p className="text-3xl font-black">{reportData.length}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700"></div>
                        <span className="ml-3 text-gray-500">Retrieving P-Series data...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="p-4 text-xs uppercase font-bold text-gray-600">SLH6 ID</th>
                                    <th className="p-4 text-xs uppercase font-bold text-gray-600">Full Name</th>
                                    <th className="p-4 text-xs uppercase font-bold text-gray-600">Gender</th>
                                    <th className="p-4 text-xs uppercase font-bold text-gray-600">District</th>
                                    <th className="p-4 text-xs uppercase font-bold text-gray-600">Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.length > 0 ? (
                                    reportData.map((person) => (
                                        <tr key={person.id} className="border-b border-gray-100 hover:bg-emerald-50 transition-colors">
                                            <td className="p-4 font-mono font-bold text-emerald-700">{person.slh6}</td>
                                            <td className="p-4 text-sm font-medium text-gray-800">
                                                {`${person.firstName} ${person.middleName || ""} ${person.lastName}`.toUpperCase()}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{person.gender || "—"}</td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {Array.isArray(person.districts) && person.districts.length > 0 
                                                    ? person.districts.join(", ") 
                                                    : (person.district || "N/A")}
                                            </td>
                                            <td className="p-4 text-sm font-mono text-gray-500">{person.phone}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-gray-400 italic">
                                            No applicants found with a "P" prefix.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer / Print Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center print:hidden">
                    <p className="text-xs text-gray-400 font-mono">Report ID: P_SERIES_{new Date().getTime()}</p>
                    <div className="space-x-3">
                        <button 
                            onClick={fetchPCodeRecords}
                            className="px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 rounded-md transition"
                        >
                            Refresh
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-emerald-700 text-white text-sm font-bold rounded-md hover:bg-emerald-800 shadow-sm transition"
                        >
                            Print Physical Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PCodeReport;