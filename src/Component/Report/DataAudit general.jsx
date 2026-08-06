import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const DataAudit = () => {
    const [brokenRecords, setBrokenRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIncompleteData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const allData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter for people without districts OR without gender
            const filtered = allData.filter(person => {
                const hasNoDistricts = !person.districts || !Array.isArray(person.districts) || person.districts.length === 0;
                const hasNoGender = !person.gender || person.gender.trim() === "";
                
                return hasNoDistricts || hasNoGender;
            });

            setBrokenRecords(filtered);
        } catch (error) {
            console.error("Error fetching audit data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncompleteData();
    }, []);

    const handleQuickFix = async (id, currentGender) => {
    // 1. Ask for the District name
    const inputDistrict = prompt("Enter District Name for this record (e.g., Bo, Bonthe, Kenema):");

    // 2. Stop if they cancel or leave it blank
    if (!inputDistrict || inputDistrict.trim() === "") {
        alert("Update cancelled. A district is required.");
        return;
    }

    // 3. Normalize to Proper Case (e.g., "bO" -> "Bo")
    const formattedDistrict = inputDistrict.trim().charAt(0).toUpperCase() + 
                              inputDistrict.trim().slice(1).toLowerCase();

    try {
        const docRef = doc(db, "hajjApplicants", id);
        
    

        alert(`Success! District updated to: ${formattedDistrict}`);
        fetchIncompleteData(); // Refresh the list to remove the fixed record
    } catch (err) {
        console.error("Quick Fix Error:", err);
        alert("Update failed. Check console for details.");
    }
};

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-red-600 p-4 flex justify-between items-center">
                    <h2 className="text-white text-xl font-bold">Data Cleanup: Missing District/Gender</h2>
                    <button 
                        onClick={fetchIncompleteData}
                        className="bg-white text-red-600 px-4 py-1 rounded text-sm font-bold hover:bg-gray-100"
                    >
                        Refresh List
                    </button>
                </div>

                {loading ? (
                    <p className="p-10 text-center">Scanning database...</p>
                ) : (
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-200 border-b">
                                <th className="p-3 text-sm font-bold">SLH6</th>
                                <th className="p-3 text-sm font-bold">Full Name</th>
                                <th className="p-3 text-sm font-bold">Gender Status</th>
                                <th className="p-3 text-sm font-bold">District Status</th>
                                <th className="p-3 text-sm font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brokenRecords.length > 0 ? (
                                brokenRecords.map((person) => (
                                    <tr key={person.id} className="border-b hover:bg-red-50">
                                        <td className="p-3 text-sm font-mono text-red-600">{person.slh6 || "MISSING"}</td>
                                        <td className="p-3 text-sm font-semibold">
                                            {`${person.firstName} ${person.middleName || ""} ${person.lastName}`.trim()}
                                        </td>
                                        <td className="p-3 text-sm">
                                            {!person.gender ? <span className="text-red-500">❌ Missing</span> : person.gender}
                                        </td>
                                        <td className="p-3 text-sm">
                                            {(!person.districts || person.districts.length === 0) 
                                                ? <span className="text-red-500">❌ Empty Array</span> 
                                                : person.districts.join(", ")}
                                        </td>
                                        <td className="p-3">
                                            <button 
                                                onClick={() => handleQuickFix(person.id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                                            >
                                                Quick Fix
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-green-600 font-bold">
                                        🎉 All records have Gender and Districts!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DataAudit;