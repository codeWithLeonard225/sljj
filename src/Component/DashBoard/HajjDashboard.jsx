import React, { useEffect, useState, useMemo } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; 
import localforage from "localforage";
import { toast } from "react-toastify";

const hajjStore = localforage.createInstance({
  name: "HajjCache",
  storeName: "hajj_gender_counts",
});

const HajjGenderDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2027"); // 🔥 Defaulting to 2027 directly
  const [allApplicants, setAllApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📅 Manual List Configuration (Removes extra Firestore reads on init)
  const availableYears = ["2027", "2026"];

  // Fetch Dashboard Analytics Metrics Data
  const fetchDashboardData = async (targetYear, forceRefresh = false) => {
    setLoading(true);
    const cacheKey = `hajj_applicants_${targetYear}`;

    try {
      if (!forceRefresh) {
        const cached = await hajjStore.getItem(cacheKey);
        if (cached && cached.data) {
          setAllApplicants(cached.data);
          setLoading(false);
          return;
        }
      }

      const collRef = collection(db, "hajjApplicants");
      let q = collRef;

      if (targetYear && targetYear !== "ALL") {
        q = query(collRef, where("applicationYear", "in", [targetYear, targetYear.toString(), Number(targetYear)]));
      }

      const snapshot = await getDocs(q);
      const freshData = snapshot.docs.map((doc) => ({
        gender: doc.data().gender,
        maritalStatus: doc.data().maritalStatus,
        districts: doc.data().districts,
        applicationYear: doc.data().applicationYear,
      }));

      setAllApplicants(freshData);
      await hajjStore.setItem(cacheKey, { timestamp: Date.now(), data: freshData });
    } catch (error) {
      console.error("Fetch data failed:", error);
      toast.error("Failed to sync records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedYear, false);
  }, [selectedYear]);

  // 📊 Computational Aggregator
  const stats = useMemo(() => {
    let male = 0;
    let female = 0;
    let genderOther = 0;
    let single = 0;
    let married = 0;
    let widow = 0;
    let maritalOther = 0;
    const districtCountMap = {};

    for (let i = 0; i < allApplicants.length; i++) {
      const applicant = allApplicants[i];

      const g = String(applicant.gender || "").trim().toLowerCase();
      if (g === "male" || g === "m") male++;
      else if (g === "female" || g === "f") female++;
      else genderOther++;

      const m = String(applicant.maritalStatus || "").trim().toLowerCase();
      if (m === "single") single++;
      else if (m === "married") married++;
      else if (m === "widow") widow++;
      else maritalOther++;

      if (Array.isArray(applicant.districts)) {
        applicant.districts.forEach((d) => {
          if (d && typeof d === "string") {
            const cleanD = d.trim();
            if (cleanD) {
              const formattedDistrict = cleanD.charAt(0).toUpperCase() + cleanD.slice(1).toLowerCase();
              districtCountMap[formattedDistrict] = (districtCountMap[formattedDistrict] || 0) + 1;
            }
          }
        });
      }
    }

    return {
      total: allApplicants.length,
      gender: { male, female, other: genderOther },
      marital: { single, married, widow, other: maritalOther },
      districts: districtCountMap
    };
  }, [allApplicants]);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">HAJJ APPLICANTS SUMMARY</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Presidential Hajj Taskforce Secretariat
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-100 p-2 rounded-xl">
          <button 
            onClick={() => fetchDashboardData(selectedYear, true)}
            className="bg-white hover:bg-slate-50 border text-slate-700 text-xs font-bold py-2 px-3 rounded-lg transition"
          >
            ↻ Refresh Data
          </button>
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white text-slate-800 font-bold text-sm px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">All Application Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>{yr} Queue</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Applicants</p>
            <p className="text-5xl font-black text-slate-900 mt-2">{stats.total}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight border-b pb-2">Gender Breakdown</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Male</p>
                    <p className="text-3xl font-black text-blue-900 mt-1">{stats.gender.male}</p>
                    <p className="text-xs font-semibold text-blue-500 mt-1">
                      {stats.total > 0 ? ((stats.gender.male / stats.total) * 100).toFixed(1) : 0}% of total
                    </p>
                  </div>
                  <div className="bg-pink-50/60 p-4 rounded-xl border border-pink-100">
                    <p className="text-xs font-bold text-pink-600 uppercase tracking-widest">Female</p>
                    <p className="text-3xl font-black text-pink-900 mt-1">{stats.gender.female}</p>
                    <p className="text-xs font-semibold text-pink-500 mt-1">
                      {stats.total > 0 ? ((stats.gender.female / stats.total) * 100).toFixed(1) : 0}% of total
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight border-b pb-2">Marital Status Breakdown</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Single</p>
                    <p className="text-2xl font-black text-emerald-900 mt-1">{stats.marital.single}</p>
                    <p className="text-xs font-semibold text-emerald-500 mt-1">
                      {stats.total > 0 ? ((stats.marital.single / stats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">Married</p>
                    <p className="text-2xl font-black text-purple-900 mt-1">{stats.marital.married}</p>
                    <p className="text-xs font-semibold text-purple-500 mt-1">
                      {stats.total > 0 ? ((stats.marital.married / stats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Widow</p>
                    <p className="text-2xl font-black text-amber-900 mt-1">{stats.marital.widow}</p>
                    <p className="text-xs font-semibold text-amber-500 mt-1">
                      {stats.total > 0 ? ((stats.marital.widow / stats.total) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 flex flex-col">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight">District Distribution</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {Object.keys(stats.districts).length} Registered Districts
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[360px]">
                {Object.keys(stats.districts).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-12">No district metrics returned.</p>
                ) : (
                  Object.entries(stats.districts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([districtName, volume]) => {
                      const distributionPercentage = stats.total > 0 ? ((volume / stats.total) * 100).toFixed(1) : 0;
                      return (
                        <div key={districtName} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-700 uppercase tracking-wide">{districtName}</span>
                            <span className="text-slate-900">
                              {volume} <span className="text-slate-400 font-normal">({distributionPercentage}%)</span>
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${distributionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HajjGenderDashboard;