import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; 

const HajjDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    gender: {},
    district: {},
    maritalStatus: {},
    sSeries: 0,
    pSeries: 0,
    generalSeries: 0,
  });
  const [loading, setLoading] = useState(true);

 const fetchStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
      const data = querySnapshot.docs.map((doc) => doc.data());

      const districtCount = {};
      const genderCount = {};
      const maritalCount = {};
      
      let sCount = 0;
      let pCount = 0;
      let gCount = 0;

      data.forEach((a) => {
        const slh6Value = a.slh6 || "";

        // 1. Series Totals Logic
        if (/^S/i.test(slh6Value)) {
          sCount++;
        } else if (/^P/i.test(slh6Value)) {
          pCount++;
        } else if (/^\d/.test(slh6Value)) {
          gCount++;
        }

        // 2. District Normalization (Bo vs BO vs bo)
        if (Array.isArray(a.districts) && a.districts.length > 0) {
          a.districts.forEach((d) => {
            // Trim and Proper Case: "  bo " -> "Bo"
            const normalizedD = d.trim().charAt(0).toUpperCase() + d.trim().slice(1).toLowerCase();
            districtCount[normalizedD] = (districtCount[normalizedD] || 0) + 1;
          });
        }

        // 3. Gender Normalization (male vs Male vs Female )
        if (a.gender) {
          // Removes spaces and ensures "Male" or "Female"
          const normalizedGender = a.gender.trim().charAt(0).toUpperCase() + a.gender.trim().slice(1).toLowerCase();
          genderCount[normalizedGender] = (genderCount[normalizedGender] || 0) + 1;
        }

        // 4. Marital Status Normalization
        if (a.maritalStatus) {
          const normalizedMarital = a.maritalStatus.trim().charAt(0).toUpperCase() + a.maritalStatus.trim().slice(1).toLowerCase();
          maritalCount[normalizedMarital] = (maritalCount[normalizedMarital] || 0) + 1;
        }
      });

      setStats({
        total: data.length,
        gender: genderCount,
        district: districtCount,
        maritalStatus: maritalCount,
        sSeries: sCount,
        pSeries: pCount,
        generalSeries: gCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p className="text-center text-gray-500 mt-10 font-bold uppercase tracking-widest">Synchronizing Dashboard...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 min-h-screen">
      
      {/* LEFT SIDE — District List */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-700">
        <h2 className="text-xl font-black text-blue-700 mb-4 uppercase tracking-tighter">Applicants by District</h2>
        <table className="min-w-full border border-gray-100 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">District</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.district)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([district, count]) => (
                <tr key={district} className="border-t hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{district}</td>
                  <td className="px-4 py-3 text-sm font-black text-blue-700">{count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT SIDE — Other Stats */}
      <div className="space-y-6">
        
        {/* Series Breakdown Section - NEW */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-black">
          <h2 className="text-xl font-black text-gray-800 mb-4 uppercase tracking-tighter">Series Breakdown</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase">S-Series</p>
              <p className="text-2xl font-black text-blue-900">{stats.sSeries}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg text-center border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase">P-Series</p>
              <p className="text-2xl font-black text-emerald-900">{stats.pSeries}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center border border-orange-100">
              <p className="text-[10px] font-bold text-orange-600 uppercase">General</p>
              <p className="text-2xl font-black text-orange-900">{stats.generalSeries}</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm font-bold text-gray-500 bg-gray-100 py-2 rounded">
            Total Record: {stats.total}
          </p>
        </div>

        {/* Existing Overview Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-blue-700 mb-4 uppercase tracking-tighter">Identity Details</h2>
          
          <div className="mb-6">
            <h3 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-widest">By Gender</h3>
            <div className="space-y-2">
              {Object.entries(stats.gender).map(([gender, count]) => (
                <div key={gender} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md">
                   <span className="text-sm font-semibold">{gender}</span>
                   <span className="font-black text-gray-700">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-widest">By Marital Status</h3>
            <div className="space-y-2">
              {Object.entries(stats.maritalStatus).map(([status, count]) => (
                 <div key={status} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md">
                    <span className="text-sm font-semibold">{status}</span>
                    <span className="font-black text-gray-700">{count}</span>
                 </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HajjDashboard;