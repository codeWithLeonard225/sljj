"use client";

import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const PhotoUpdate = () => {
    const [submissions, setSubmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Ref to handle the hidden file input
    const fileInputRef = useRef(null);
    const [activeTarget, setActiveTarget] = useState({ id: null, type: null });

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const data = querySnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
                fullName: `${docSnap.data().firstName || ""} ${docSnap.data().lastName || ""}`
            }));
            // Sort: missing photos at the top
            setSubmissions(data.sort((a, b) => (!a.pilgrimPhoto ? -1 : 1)));
        } catch (error) {
            console.error("Fetch error:", error);
        }
        setLoading(false);
    };

    useEffect(() => { fetchSubmissions(); }, []);

    // Handle File Selection
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const { id, type } = activeTarget;
        
        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result;
            try {
                const docRef = doc(db, "hajjApplicants", id);
                await updateDoc(docRef, { [type]: base64Data });
                
                // Update local UI
                setSubmissions(prev => prev.map(item => 
                    item.id === id ? { ...item, [type]: base64Data } : item
                ));
                
                alert("Photo uploaded successfully!");
            } catch (error) {
                alert("Upload failed: " + error.message);
            }
        };
        reader.readAsDataURL(file);
        
        // Reset input so the same file can be selected again if needed
        e.target.value = null;
    };

    const triggerUpload = (id, type) => {
        setActiveTarget({ id, type });
        fileInputRef.current.click();
    };

    const filtered = submissions.filter(s => 
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">Photo Records Manager</h1>
                        <p className="text-sm text-gray-500">Quickly upload missing photos for pilgrims</p>
                    </div>
                    <input 
                        type="text"
                        placeholder="Search name or passport..."
                        className="border-2 border-green-100 p-3 rounded-xl w-full md:w-80 shadow-sm focus:border-green-500 outline-none transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-10 font-bold text-gray-400">Loading Database...</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-green-700 text-white">
                                    <th className="p-4 font-semibold uppercase text-xs">Pilgrim Details</th>
                                    <th className="p-4 font-semibold uppercase text-xs text-center">Pilgrim Photo</th>
                                    <th className="p-4 font-semibold uppercase text-xs text-center">Passport Photo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-green-50/50 border-b transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{item.fullName}</div>
                                            <div className="text-sm text-gray-500 font-mono">{item.passportNumber || "No Passport #"}</div>
                                        </td>
                                        
                                        {/* Pilgrim Photo Column */}
                                        <td className="p-4">
                                            <div className="flex flex-col items-center gap-2">
                                                {item.pilgrimPhoto ? (
                                                    <img src={item.pilgrimPhoto} className="w-16 h-16 rounded-lg object-cover ring-2 ring-green-100" alt="Pilgrim" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center border-2 border-dashed border-red-200">
                                                        <span className="text-[10px] text-red-400 font-bold">MISSING</span>
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => triggerUpload(item.id, 'pilgrimPhoto')}
                                                    className="bg-gray-100 hover:bg-green-600 hover:text-white text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full transition-all uppercase"
                                                >
                                                    {item.pilgrimPhoto ? 'Change' : 'Upload'}
                                                </button>
                                            </div>
                                        </td>

                                        {/* Passport Photo Column */}
                                        <td className="p-4">
                                            <div className="flex flex-col items-center gap-2">
                                                {item.passportPhoto ? (
                                                    <img src={item.passportPhoto} className="w-16 h-16 rounded-lg object-cover ring-2 ring-blue-100" alt="Passport" />
                                                ) : (
                                                    <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center border-2 border-dashed border-red-200">
                                                        <span className="text-[10px] text-red-400 font-bold">MISSING</span>
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => triggerUpload(item.id, 'passportPhoto')}
                                                    className="bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full transition-all uppercase"
                                                >
                                                    {item.passportPhoto ? 'Change' : 'Upload'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="p-10 text-center text-gray-400 font-medium">No records found matching that search.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoUpdate;