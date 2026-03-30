import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const BulkHajjRegistration = () => {
    const navigate = useNavigate();

    // Full list of pilgrims from your spreadsheet
    const [pilgrims, setPilgrims] = useState([
        { slh6: "P002", firstName: "Foday Sewa", lastName: "Kamara", dob: "11/05/1964", gender: "Male", occupation: "IMAM", passportNumber: "SLR194464" },
        // { slh6: "P003", firstName: "Isata", lastName: "Bah", dob: "03/04/1962", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR194438" },
        // { slh6: "P004", firstName: "Nsorie", lastName: "Yansaneh", dob: "25/02/1967", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR194466" },
        // { slh6: "P005", firstName: "Fatmata", lastName: "Sankoh", dob: "20/01/1964", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR138071" },
        // { slh6: "P006", firstName: "Marie", lastName: "Kamara", dob: "15/07/1964", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR206038" },
        // { slh6: "P007", firstName: "Jaka", lastName: "Jabbie", dob: "10/05/1974", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR199495" },
        // { slh6: "P008", firstName: "Henry Bundu", lastName: "Sesay", dob: "24/08/1962", gender: "Male", occupation: "RTD POLICE OFFICER", passportNumber: "SLR179948" },
        // { slh6: "P009", firstName: "Iysha I Sesay", lastName: "Newsome", dob: "23/09/1955", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR129645" },
        // { slh6: "P010", firstName: "Salami", lastName: "Savage", dob: "16/12/1965", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR195663" },
        // { slh6: "P011", firstName: "Fatmata Binta", lastName: "Conteh", dob: "15/01/1982", gender: "Female", occupation: "NURSE", passportNumber: "SLR197496" },
        // { slh6: "P012", firstName: "Mariama", lastName: "Jalloh", dob: "01/04/1963", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR184797" },
        // { slh6: "P013", firstName: "Mariama", lastName: "Jalloh", dob: "05/08/1969", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR200364" },
        // { slh6: "P014", firstName: "Abubakarr", lastName: "Bah", dob: "10/08/1955", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR200361" },
        // { slh6: "P015", firstName: "Chernor Saadu", lastName: "Jalloh", dob: "20/06/1954", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR196737" },
        // { slh6: "P016", firstName: "Fatmata", lastName: "Bah", dob: "17/04/1962", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR033167" },
        // { slh6: "P017", firstName: "Mohamed", lastName: "Barrie", dob: "18/09/1976", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR038880" },
        // { slh6: "P018", firstName: "Osman", lastName: "Conteh", dob: "19/02/1978", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR199229" },
        // { slh6: "P019", firstName: "Ibrahim", lastName: "Sesay", dob: "17/09/1977", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR191179" },
        // { slh6: "P020", firstName: "Mamie", lastName: "Kamara", dob: "16/07/1955", gender: "Female", occupation: "WIDOW", passportNumber: "SLR184229" },
        // { slh6: "P021", firstName: "Isata", lastName: "Bah", dob: "26/11/1963", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR045466" },
        // { slh6: "P022", firstName: "Binta", lastName: "Bah", dob: "30/05/1969", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR196387" },
        // { slh6: "P023", firstName: "Mariama Seray", lastName: "Bayoh", dob: "12/09/1978", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR093682" },
        // { slh6: "P024", firstName: "Ibrahim Abubakarr", lastName: "Ngombu", dob: "15/09/1978", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR163774" },
        // { slh6: "P025", firstName: "Musa Yankuba", lastName: "Kamara", dob: "07/02/1960", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR206973" },
        // { slh6: "P026", firstName: "Rahmatulai", lastName: "Kebe", dob: "11/10/1958", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR206760" },
        // { slh6: "P027", firstName: "Mabinty", lastName: "Koroma", dob: "13/06/1945", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR193784" },
        // { slh6: "P028", firstName: "Saio", lastName: "Kamara", dob: "06/08/1950", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR208335" },
        // { slh6: "P029", firstName: "Mayeanie", lastName: "Kargbo", dob: "10/02/1972", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR163545" },
        // { slh6: "P030", firstName: "Abdulai", lastName: "Sesay", dob: "24/08/1955", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR210384" },
        // { slh6: "P031", firstName: "Tilda", lastName: "Kebbay", dob: "13/03/1965", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR209111" },
        // { slh6: "P032", firstName: "Fatoumata Diariou", lastName: "Balde", dob: "25/06/1956", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR211531" },
        // { slh6: "P033", firstName: "Ali Yeroh", lastName: "Jalloh", dob: "07/01/1986", gender: "Female", occupation: "NURSE", passportNumber: "SLR194662" },
        // { slh6: "P034", firstName: "Mamadou Bobo", lastName: "Barry", dob: "03/04/1978", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR211631" },
        // { slh6: "P035", firstName: "Abubakarr", lastName: "Jalloh", dob: "27/10/1974", gender: "Male", occupation: "BANKER", passportNumber: "SLR210433" },
        // { slh6: "P036", firstName: "Mohamed", lastName: "Jalloh", dob: "07/07/1954", gender: "Male", occupation: "IMAM", passportNumber: "SLR206963" },
        // { slh6: "P037", firstName: "Fatmata", lastName: "Tarawally", dob: "05/01/1979", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR209210" },
        // { slh6: "P038", firstName: "Kama Alieu", lastName: "Malador", dob: "24/03/1985", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR133272" },
        // { slh6: "P039", firstName: "Siesay", lastName: "Kebbay", dob: "07/05/1971", gender: "Male", occupation: "BUSINESS", passportNumber: "ER316821" },
        // { slh6: "P040", firstName: "Marie", lastName: "Nabie", dob: "27/04/1967", gender: "Female", occupation: "BUSINESS", passportNumber: "ER334330" },
        // { slh6: "P041", firstName: "Ahmad Ramadan", lastName: "Jalloh", dob: "25/01/1968", gender: "Male", occupation: "IMAM", passportNumber: "ER305973" },
        // { slh6: "P042", firstName: "Ibrahim", lastName: "Samura", dob: "19/07/1982", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR192241" },
        // { slh6: "P043", firstName: "Bilkisu Borjeh", lastName: "Barrie", dob: "06/11/1961", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR204053" },
        // { slh6: "P044", firstName: "Yayah Mohamed", lastName: "Nabie", dob: "10/01/1950", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR193830" },
        // { slh6: "P045", firstName: "Adams Sanpha", lastName: "Kargbo", dob: "07/02/1975", gender: "Male", occupation: "BUSINESS", passportNumber: "ES008539" },
        // { slh6: "P046", firstName: "Ibrahim Bailor", lastName: "Barrie", dob: "18/06/1970", gender: "Male", occupation: "BUSINESS", passportNumber: "SLR098830" },
        // { slh6: "P047", firstName: "Abassie Elias", lastName: "Thomas", dob: "29/08/1971", gender: "Male", occupation: "BUSINESS", passportNumber: "SLS001275" },
        // { slh6: "P048", firstName: "Mohamed Gento", lastName: "Kamara", dob: "28/12/1973", gender: "Male", occupation: "BUSINESS", passportNumber: "SLD000888" },
        // { slh6: "P049", firstName: "Hawa", lastName: "Kebbay", dob: "01/09/1976", gender: "Female", occupation: "BUSINESS", passportNumber: "SLR096103" },
        // { slh6: "P050", firstName: "Kawusu", lastName: "Kebbay", dob: "02/10/1966", gender: "Male", occupation: "BUSINESS", passportNumber: "SLD000841" },
        // { slh6: "P051", firstName: "Maimounatou", lastName: "Kamara", dob: "26/06/1974", gender: "Female", occupation: "NURSE", passportNumber: "SLR204201" },
        // { slh6: "P052", firstName: "Mawiatou", lastName: "Dem", dob: "17/02/1959", gender: "Male", occupation: "BUSINESS", passportNumber: "N/A" },
        // { slh6: "P053", firstName: "Mamadama", lastName: "Turay", dob: "26/04/1961", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR212984" },
        // { slh6: "P054", firstName: "Mabinty", lastName: "Sesay", dob: "08/05/1961", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR196400" },
        // { slh6: "P055", firstName: "Fatu", lastName: "Faye", dob: "02/01/1975", gender: "Female", occupation: "HOUSE WIFE", passportNumber: "SLR156709" },
        // { slh6: "P056", firstName: "Mohamed", lastName: "Kamara", dob: "13/06/1974", gender: "Male", occupation: "CEO", passportNumber: "ER369178" },
        // { slh6: "P057", firstName: "Siamba", lastName: "Kamara", dob: "14/04/1976", gender: "Female", occupation: "TERMINAL MANAGER", passportNumber: "SLR129685" }
    ]);

    const [commonData] = useState({
        applicationYear: "2026",
        residingInSL: "Yes",
        status: "Pending"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleGender = (index) => {
        const updated = [...pilgrims];
        updated[index].gender = updated[index].gender === "Male" ? "Female" : "Male";
        setPilgrims(updated);
    };

    const handleBulkSubmit = async () => {
        if (!window.confirm(`Register all ${pilgrims.length} pilgrims?`)) return;
        
        setIsSubmitting(true);
        const toastId = toast.loading("Processing batch upload...");

        try {
            for (const person of pilgrims) {
                const finalData = {
                    ...person,
                    ...commonData,
                    firstName: person.firstName.toUpperCase(),
                    lastName: person.lastName.toUpperCase(),
                    timestamp: serverTimestamp(),
                    hajjBefore: "No",
                    medicalCondition: "No",
                    dietNeeds: "No"
                };

                await addDoc(collection(db, "hajj_applications"), finalData);
            }
            
            toast.update(toastId, { render: `Successfully registered ${pilgrims.length} pilgrims!`, type: "success", isLoading: false, autoClose: 3000 });
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Upload failed. Check connection.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-green-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-wide">Bulk Hajj Registration</h2>
                        <p className="text-xs opacity-75 mt-1 font-medium">Islamic Session 2026 / 1447 AH</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase border-b border-white hover:opacity-70">
                        Cancel
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-gray-50 p-3 rounded border text-center">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Session</p>
                            <p className="font-bold text-gray-800">{commonData.applicationYear}</p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-3 rounded border text-center">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Total Batch</p>
                            <p className="font-bold text-gray-800">{pilgrims.length} Records</p>
                        </div>
                    </div>

                    <div className="max-h-[450px] overflow-y-auto rounded border bg-gray-50 divide-y shadow-inner">
                        {pilgrims.map((person, index) => (
                            <div key={index} className="flex justify-between items-center p-4 hover:bg-white transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-900 leading-tight">
                                        {index + 1}. {person.firstName} {person.lastName}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono mt-1">
                                        ID: <span className="text-green-700 font-bold">{person.slh6}</span> | DOB: {person.dob} | PASSPORT: {person.passportNumber}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => toggleGender(index)}
                                    className={`text-[10px] px-4 py-1 rounded-full font-black uppercase tracking-tighter ${
                                        person.gender === "Male" ? "bg-blue-600 text-white" : "bg-pink-600 text-white"
                                    }`}
                                >
                                    {person.gender}
                                </button>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={handleBulkSubmit}
                        disabled={isSubmitting}
                        className="w-full mt-6 bg-green-700 text-white py-4 rounded-lg font-black text-lg hover:bg-green-800 disabled:bg-gray-400 shadow-xl transition-all transform active:scale-[0.98]"
                    >
                        {isSubmitting ? "SYNCING TO DATABASE..." : `FINALIZE ${pilgrims.length} REGISTRATIONS`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkHajjRegistration;