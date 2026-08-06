"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const Tag = () => {
    const [submissions, setSubmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState("");
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    
    // States for manual physical numbering
    const [manualBatch, setManualBatch] = useState("Batch 1");
    const [manualCount, setManualCount] = useState("");

    const fetchSubmissions = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
            const data = querySnapshot.docs.map((docSnap) => {
                const docData = docSnap.data();
                const fullName = `${docData.firstName || ""} ${docData.middleName || ""} ${docData.lastName || ""}`.replace(/\s+/g, " ").trim();
                return { id: docSnap.id, ...docData, fullName };
            });
            const sorted = data.sort((a, b) => (parseInt(a.slh6 || "999999") - parseInt(b.slh6 || "999999")));
            setSubmissions(sorted);
            setFilteredSubmissions(sorted); // Initialize filtered list
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    useEffect(() => { fetchSubmissions(); }, []);

    // Filter Logic
    useEffect(() => {
        const filtered = submissions.filter((item) =>
            item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSubmissions(filtered);
    }, [searchTerm, submissions]);

    const handleDelete = async (id) => {
        if (prompt("Enter password to delete:") !== "1718") return alert("Wrong Password");
        try {
            await deleteDoc(doc(db, "hajjApplicants", id));
            alert("Deleted Successfully");
            setSelectedSubmission(null);
            fetchSubmissions();
        } catch (error) { alert("Delete Failed"); }
    };

    const handlePrintPass = () => {
        if (!selectedSubmission) return;

        const fullName = selectedSubmission.fullName;
        const photo = selectedSubmission.pilgrimPhoto || "";
        const passportNo = selectedSubmission.passportNumber || "N/A";

        const passContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hajj Pass - ${fullName}</title>
            <style>
                @page { size: A4 portrait; margin: 0; }
                body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                .page { width: 210mm; height: 297mm; display: flex; flex-direction: column; }
                .pass {
                    width: 100%; height: 148.5mm; position: relative; overflow: hidden;
                    display: flex; flex-direction: column; justify-content: center;
                    padding: 40px; box-sizing: border-box; border-bottom: 3px dashed #000;
                    background-image: url('/images/needed.png'); background-position: center;
                    background-repeat: no-repeat; background-size: contain;
                }
                .overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.85); z-index: 1; }
                .content { position: relative; z-index: 5; width: 100%; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; }
                .title { width: 100%; font-size: 28px; font-weight: bold; margin-bottom: 30px; color: #15803d; text-align: center; border-bottom: 2px solid #15803d; padding-bottom: 10px; }
                .left { width: 60%; }
                .name { font-size: 48px;margin-top: 100px; font-weight: 900; line-height: 1.1; text-transform: uppercase; }
                .batch-tag { margin-top: 100px; font-size: 50px; font-weight: bold; color: #444; border-left: 8px solid #15803d; padding-left: 15px; }
                .right { width: 35%; text-align: center; }
                .photo { width: 220px; height: 260px; object-fit: cover; border: 5px solid #000; border-radius: 10px; background: #fff; }
                .label { margin-top: 10px; font-size: 16px; font-weight: bold; text-transform: uppercase; color: #666; }
                .id-box { font-size: 32px; font-weight: bold; border: 3px solid #000; padding: 5px 10px; background: #fff; display: inline-block; min-width: 180px; }
                .count-box { margin-top: 10px; font-size: 60px; font-weight: 900; color: #15803d; }
                @media print { * { -webkit-print-color-adjust: exact !important; } }
            </style>
        </head>
        <body>
            <div class="page">
                ${[1, 2].map(() => `
                <div class="pass">
                    <div class="overlay"></div>
                    <div class="content">
                        <div class="title">PRESIDENTIAL HAJJ TASKFORCE SECRETARIAT</div>
                        <div class="left">
                            <div class="name">${fullName}</div>
                            <div class="batch-tag">${manualBatch}</div>
                        </div>
                        <div class="right">
                            <img src="${photo}" class="photo" />
                            <div class="label">Passport No.</div>
                            <div class="id-box">${passportNo}</div>
                            <div class="count-box"># ${manualCount}</div>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
            <script>
                window.onload = function() {
                    setTimeout(() => { window.print(); window.close(); }, 500);
                };
            </script>
        </body>
        </html>
        `;

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(passContent);
            printWindow.document.close();
        }
    };

    return (
        <div className="min-h-screen p-5 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border-t-4 border-green-700 mb-8">
                <h2 className="text-2xl font-bold text-green-900 mb-4">Print Pilgrim ID Tags</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase">Search Name or Passport</label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                🔍
                            </span>
                            <input 
                                type="text"
                                placeholder="Start typing name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border pl-10 p-3 rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Select Dropdown (Now filtered by search) */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Select From Results ({filteredSubmissions.length})</label>
                        <select
                            value={selectedSubmissionId}
                            onChange={(e) => {
                                const id = e.target.value;
                                setSelectedSubmissionId(id);
                                setSelectedSubmission(submissions.find(s => s.id === id) || null);
                            }}
                            className="w-full mt-1 border p-3 rounded-lg bg-gray-50 focus:border-green-600 outline-none"
                        >
                            <option value="">-- {searchTerm ? "Select from filtered list" : "Choose Pilgrim"} --</option>
                            {filteredSubmissions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.fullName} ({item.passportNumber || "No Passport"})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedSubmission && (
                    <div className="mt-6 grid md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-100 animate-in fade-in duration-300">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Manual Batch (Left)</label>
                            <input 
                                type="text"
                                value={manualBatch}
                                onChange={(e) => setManualBatch(e.target.value)}
                                placeholder="e.g. Batch 1"
                                className="w-full border p-2 rounded font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Manual Count (Right)</label>
                            <input 
                                type="text"
                                value={manualCount}
                                onChange={(e) => setManualCount(e.target.value)}
                                placeholder="e.g. 001"
                                className="w-full border p-2 rounded font-bold text-green-700"
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-4 mt-2">
                            <button onClick={handlePrintPass} className="bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 shadow-lg transition flex-1">
                                🖨️ Print Tag
                            </button>
                            <button onClick={() => handleDelete(selectedSubmission.id)} className="text-red-600 text-sm hover:bg-red-50 px-3 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* LIVE PREVIEW SECTION */}
            {selectedSubmission && (
                <div className="max-w-4xl mx-auto opacity-90 scale-90 origin-top pb-20">
                   <div className="bg-white border-2 border-dashed p-4 rounded-lg flex flex-col items-center">
                        <div className="border shadow-2xl bg-white overflow-hidden" style={{width: '210mm'}}>
                            <div className="p-10 flex flex-wrap justify-between items-start relative" style={{height: '148.5mm'}}>
                                <img src="/images/needed.png" className="absolute inset-0 opacity-10 w-full h-full object-contain" alt="" />
                                
                                <div className="w-full text-center border-b-2 border-green-700 pb-4 mb-8 z-10">
                                    <div className="text-2xl font-bold text-green-700">PRESIDENTIAL HAJJ TASKFORCE</div>
                                </div>

                                <div className="z-10 flex-1">
                                    <div className="text-5xl font-black uppercase break-words">{selectedSubmission.fullName}</div>
                                    <div className="mt-12 text-5xl font-bold border-l-8 border-green-600 pl-6 text-gray-700">{manualBatch}</div>
                                </div>

                                <div className="z-10 text-center ml-4">
                                    <img src={selectedSubmission.pilgrimPhoto} className="w-48 h-56 object-cover border-4 border-black rounded-lg shadow-md" alt="" />
                                    <div className="text-xs font-bold mt-4 text-gray-500 uppercase">Passport No.</div>
                                    <div className="text-2xl font-bold border-2 border-black px-4 py-1 bg-white inline-block">{selectedSubmission.passportNumber}</div>
                                    <div className="text-6xl font-black text-green-700 mt-4"># {manualCount}</div>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            )}
        </div>
    );
};

export default Tag;