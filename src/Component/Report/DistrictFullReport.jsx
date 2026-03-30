import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const DistrictFullReport = () => {
    const [allApplicants, setAllApplicants] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [districtsList, setDistrictsList] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("All");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAllApplicants(data);
            setFilteredData(data);

            // Extract unique districts for the dropdown filter
            const uniqueDistricts = new Set();
            data.forEach(person => {
                if (Array.isArray(person.districts)) {
                    person.districts.forEach(d => uniqueDistricts.add(d));
                }
            });
            setDistrictsList(["All", ...Array.from(uniqueDistricts).sort()]);

        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter logic
    useEffect(() => {
        if (selectedDistrict === "All") {
            setFilteredData(allApplicants);
        } else {
            const filtered = allApplicants.filter(person => 
                Array.isArray(person.districts) && person.districts.includes(selectedDistrict)
            );
            setFilteredData(filtered);
        }
    }, [selectedDistrict, allApplicants]);

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-200">
                
                {/* Header & Filter Section */}
                <div className="bg-slate-800 p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 print:bg-white print:text-black print:border-b-2">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">District Master Report</h1>
                        <p className="text-slate-400 text-xs font-bold uppercase">Hajj 2026 Database</p>
                    </div>

                    <div className="flex items-center gap-3 print:hidden">
                        <label className="text-xs font-bold uppercase text-slate-400">Filter By District:</label>
                        <select 
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="bg-slate-700 text-white border border-slate-600 px-4 py-2 rounded-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {districtsList.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Statistics Summary */}
                <div className="bg-slate-50 border-b px-6 py-4 flex justify-between items-center">
                    <div className="text-sm">
                        <span className="text-gray-500 uppercase font-bold text-[10px]">Showing: </span>
                        <span className="font-black text-slate-800">{selectedDistrict}</span>
                    </div>
                    <div className="text-sm">
                        <span className="text-gray-500 uppercase font-bold text-[10px]">Total Records: </span>
                        <span className="font-black text-blue-700">{filteredData.length}</span>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center font-bold text-gray-400 animate-pulse uppercase">Generating Report...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b-2 border-gray-200">
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-500">SLH6</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-500">Full Name</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-500 text-center">Gender</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-500">Marital Status</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-500">Passport</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-gray-500">Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((person) => (
                                        <tr key={person.id} className="border-b border-gray-50 hover:bg-blue-50 transition-colors">
                                            <td className="p-4 font-mono font-bold text-blue-700 text-sm">{person.slh6 || "—"}</td>
                                            <td className="p-4 text-sm font-bold text-gray-800 uppercase">
                                                {`${person.firstName} ${person.middleName || ""} ${person.lastName}`}
                                            </td>
                                            <td className="p-4 text-sm text-center font-medium text-gray-600">{person.gender || "—"}</td>
                                            <td className="p-4 text-sm text-gray-600">{person.maritalStatus || "—"}</td>
                                            <td className="p-4 text-sm font-mono text-gray-600">{person.passportNumber || "N/A"}</td>
                                            <td className="p-4 text-sm font-mono text-gray-600">{person.phone || "—"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-20 text-center text-gray-400 italic">No records found for this district.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Print Action */}
                <div className="p-6 bg-gray-50 border-t flex justify-end print:hidden">
                    <button 
                        onClick={() => window.print()}
                        className="bg-blue-700 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-blue-800 shadow-lg active:scale-95 transition-all"
                    >
                        Print Full Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DistrictFullReport;