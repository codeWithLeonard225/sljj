import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const GeneralSeriesReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGeneralRecords = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const allData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter for SLH6 that starts with a number (0-9)
            // This excludes 'S045' and 'P048'
            const filtered = allData.filter(person => 
                person.slh6 && /^\d/.test(person.slh6)
            );

            // Numerical Sort for IDs like "001", "010", "002"
            const sorted = filtered.sort((a, b) => {
                const numA = parseInt(a.slh6, 10) || 0;
                const numB = parseInt(b.slh6, 10) || 0;
                return numA - numB;
            });

            setReportData(sorted);
        } catch (error) {
            console.error("Error fetching General Series:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGeneralRecords();
    }, []);

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white shadow-xl border border-slate-200 rounded-xl overflow-hidden">
                
                {/* Header Section - Blue Theme for General List */}
                <div className="bg-blue-800 text-white p-6 flex justify-between items-center print:text-black print:border-b-2 print:border-black">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">GENERAL SERIES REPORT (001+)</h1>
                        <p className="text-blue-100 print:text-gray-600 italic">Standard Applicant Queue</p>
                    </div>
                    <div className="text-right bg-blue-900 px-4 py-2 rounded-lg">
                        <p className="text-xs uppercase opacity-70">Total Applicants</p>
                        <p className="text-3xl font-black">{reportData.length}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-slate-400 animate-pulse">Scanning Standard Records...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 border-b border-slate-300">
                                    <th className="p-4 text-xs font-bold text-slate-600 uppercase">SLH6 ID</th>
                                    <th className="p-4 text-xs font-bold text-slate-600 uppercase">Full Name</th>
                                    <th className="p-4 text-xs font-bold text-slate-600 uppercase">Gender</th>
                                    <th className="p-4 text-xs font-bold text-slate-600 uppercase">District</th>
                                    <th className="p-4 text-xs font-bold text-slate-600 uppercase">Contact No.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.length > 0 ? (
                                    reportData.map((person) => (
                                        <tr key={person.id} className="border-b border-slate-100 hover:bg-blue-50 transition-colors">
                                            <td className="p-4 font-mono font-bold text-blue-800">{person.slh6}</td>
                                            <td className="p-4 text-sm font-semibold text-slate-800">
                                                {`${person.firstName} ${person.middleName || ""} ${person.lastName}`.toUpperCase()}
                                            </td>
                                            <td className="p-4 text-sm text-slate-600">{person.gender || "—"}</td>
                                            <td className="p-4 text-sm text-slate-600">
                                                {Array.isArray(person.districts) 
                                                    ? person.districts.join(", ") 
                                                    : (person.district || "N/A")}
                                            </td>
                                            <td className="p-4 text-sm font-mono text-slate-500">{person.phone}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-12 text-center text-slate-400 italic">
                                            No numerical-only records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer / Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center print:hidden">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Confidential Government Document</p>
                    <div className="flex gap-4">
                        <button 
                            onClick={fetchGeneralRecords}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-800"
                        >
                            Reload
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="px-6 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-black transition shadow-lg"
                        >
                            Print Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSeriesReport;