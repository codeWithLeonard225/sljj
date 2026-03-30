import React, { useState } from "react";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed

const ProperCaseStandardizer = () => {
    const [status, setStatus] = useState("Ready");
    const [count, setCount] = useState(0);

    // Function to convert "BONTHE" or "bo" to "Bonthe" or "Bo"
    const toProperCase = (str) => {
        if (!str) return "";
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim(); // Also removes accidental extra spaces
    };

    const handleStandardize = async () => {
        if (!window.confirm("Convert all districts to Proper Case (e.g., Bo, Bonthe)?")) return;

        setStatus("Processing...");
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const batch = writeBatch(db);
            let updated = 0;

            querySnapshot.docs.forEach((document) => {
                const data = document.data();
                let needsUpdate = false;
                let fixedDistricts = [];

                if (Array.isArray(data.districts)) {
                    // If empty [], we can set a default or leave it, 
                    // but usually, it's best to fill it if you know the default.
                    if (data.districts.length === 0) {
                        fixedDistricts = ["Bonthe"]; // Adjust default if needed
                        needsUpdate = true;
                    } else {
                        fixedDistricts = data.districts.map(d => {
                            const proper = toProperCase(d);
                            if (proper !== d) needsUpdate = true;
                            return proper;
                        });
                    }
                }

                if (needsUpdate) {
                    const docRef = doc(db, "hajjApplicants", document.id);
                    batch.update(docRef, { districts: fixedDistricts });
                    updated++;
                }
            });

            if (updated > 0) {
                await batch.commit();
                setCount(updated);
                setStatus("Complete");
            } else {
                setStatus("No changes needed");
            }
        } catch (error) {
            console.error(error);
            setStatus("Error occurred");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-6 border-t-4 border-indigo-600">
                <h2 className="text-xl font-black text-gray-800 mb-4 text-center uppercase tracking-tight">
                    District Cleanup Tool
                </h2>

                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                    <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Transformation Logic</p>
                    <ul className="text-sm space-y-1 text-gray-700">
                        <li><span className="line-through text-gray-400">BO</span> → <span className="font-bold">Bo</span></li>
                        <li><span className="line-through text-gray-400">BONTHE</span> → <span className="font-bold">Bonthe</span></li>
                        <li><span className="line-through text-gray-400">[]</span> → <span className="font-bold">["Bonthe"]</span></li>
                    </ul>
                </div>

                <div className="mb-6">
                    <button
                        onClick={handleStandardize}
                        disabled={status === "Processing..."}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                            status === "Processing..." ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {status === "Processing..." ? "Fixing Database..." : "Standardize Districts"}
                    </button>
                </div>

                {status === "Complete" && (
                    <div className="text-center p-3 bg-green-100 text-green-700 rounded-lg font-bold">
                        Successfully fixed {count} records!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProperCaseStandardizer;