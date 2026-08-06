import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; 

const SCodeReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSCodeRecords = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const allData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const filtered = allData.filter(person => 
                person.slh6 && /^S/i.test(person.slh6)
            );

            const sorted = filtered.sort((a, b) => {
                const numA = parseInt(a.slh6.replace(/\D/g, ''), 10) || 0;
                const numB = parseInt(b.slh6.replace(/\D/g, ''), 10) || 0;
                return numA - numB;
            });

            setReportData(sorted);
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSCodeRecords();
    }, []);

    return (
        <div className="p-8 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto border border-gray-300 shadow-sm p-6">
                
                {/* Statistics Bar - New Section */}
                {!loading && (
                    <div className="mb-6 flex justify-end">
                        <div className="bg-blue-50 border border-blue-200 px-6 py-3 rounded-lg text-right">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Total S-Series</p>
                            <p className="text-3xl font-black text-blue-900">{reportData.length}</p>
                        </div>
                    </div>
                )}

                {/* Report Header */}
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-tighter">Special Category Report (Series S)</h1>
                    <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-lg animate-pulse">Loading Records...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-y border-gray-400">
                                <th className="p-3 font-bold text-sm">SLH6 ID</th>
                                <th className="p-3 font-bold text-sm">Full Name</th>
                                <th className="p-3 font-bold text-sm text-center">Gender</th>
                                <th className="p-3 font-bold text-sm">District</th>
                                <th className="p-3 font-bold text-sm">Passport No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((person) => (
                                    <tr key={person.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 font-mono font-bold text-blue-700">{person.slh6}</td>
                                        <td className="p-3 text-sm">
                                            {`${person.firstName} ${person.middleName || ""} ${person.lastName}`.toUpperCase()}
                                        </td>
                                        <td className="p-3 text-sm text-center">{person.gender || "—"}</td>
                                        <td className="p-3 text-sm">
                                            {Array.isArray(person.districts) 
                                                ? person.districts.join(", ") 
                                                : (person.district || "N/A")}
                                        </td>
                                        <td className="p-3 text-sm font-mono">{person.passportNumber || "MISSING"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-500 italic">
                                        No records found starting with "S".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* Report Footer */}
                <div className="mt-8 flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                    <p>Verified Internal Document - Page 1 of 1</p>
                    <div className="flex gap-4">
                         <button 
                            onClick={fetchSCodeRecords} 
                            className="text-gray-400 hover:text-black font-bold uppercase print:hidden"
                        >
                            Reload
                        </button>
                        <button 
                            onClick={() => window.print()} 
                            className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 print:hidden transition shadow-md"
                        >
                            Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SCodeReport;