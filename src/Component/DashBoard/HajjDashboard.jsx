import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../firebase"; 
import localforage from "localforage";
import { toast } from "react-toastify";

// 💾 LocalForage Cache Setup
const hajjStore = localforage.createInstance({
  name: "HajjCache",
  storeName: "hajj_gender_counts",
});

const HajjGenderDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [allApplicants, setAllApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]);

  // 1. 🚀 Cache-First Loading + Real-Time Snapshot Sync
  useEffect(() => {
    let isMounted = true;
    const cacheKey = `hajj_applicants_${selectedYear}`;

    const loadAndListen = async () => {
      // Step A: Immediate Local cache readout
      try {
        const cached = await hajjStore.getItem(cacheKey);
        if (cached && cached.data && isMounted) {
          setAllApplicants(cached.data);
          setLoading(false); 
        } else if (isMounted) {
          setLoading(true);
        }
      } catch (e) {
        console.error("Cache read failed:", e);
      }

      // Step B: Target query construction
      const collRef = collection(db, "hajjApplicants");
      let q = collRef;

      if (selectedYear !== "ALL") {
        q = query(collRef, where("applicationYear", "in", [selectedYear, Number(selectedYear)]));
      }

      // Step C: Open selective parameters payload listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const freshData = snapshot.docs.map((doc) => ({
            gender: doc.data().gender,
            maritalStatus: doc.data().maritalStatus,
            districts: doc.data().districts, // Maps districts property
            applicationYear: doc.data().applicationYear,
          }));

          if (isMounted) {
            setAllApplicants(freshData);
            setLoading(false);
          }

          // Step D: Write clean state to local store
          hajjStore
            .setItem(cacheKey, { timestamp: Date.now(), data: freshData })
            .catch((err) => console.error("Cache write failed:", err));
        },
        (error) => {
          console.error("Firestore listener error:", error);
          toast.error("Failed to sync records.");
          if (isMounted) setLoading(false);
        }
      );

      return unsubscribe;
    };

    const cleanupPromise = loadAndListen();

    return () => {
      isMounted = false;
      cleanupPromise.then((unsub) => unsub && unsub());
    };
  }, [selectedYear]);

  // 2. 📅 Extract Dynamic Application Years Selector
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "hajjApplicants"), (snapshot) => {
      const yearsSet = new Set();
      snapshot.docs.forEach((doc) => {
        const yr = doc.data()?.applicationYear;
        if (yr) yearsSet.add(yr.toString());
      });
      setAvailableYears(Array.from(yearsSet).sort((a, b) => b.localeCompare(a)));
    });
    return () => unsub();
  }, []);

  // 3. 📊 Highly Optimized Single-Pass Computational Aggregator
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

      // A. Gender Sorting
      const g = String(applicant.gender || "").trim().toLowerCase();
      if (g === "male" || g === "m") male++;
      else if (g === "female" || g === "f") female++;
      else genderOther++;

      // B. Marital Sorting
      const m = String(applicant.maritalStatus || "").trim().toLowerCase();
      if (m === "single") single++;
      else if (m === "married") married++;
      else if (m === "widow") widow++;
      else maritalOther++;

      // C. District Aggregation & Format Safety Normalizer
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
      {/* HEADER CONTROLS SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            HAJJ APPLICANTS SUMMARY
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Presidential Hajj Taskforce Secretariat
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-100 p-2 rounded-xl">
          <label htmlFor="yearFilter" className="text-xs font-bold uppercase text-slate-600 pl-2">
            Filter Year:
          </label>
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white text-slate-800 font-bold text-sm px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="ALL">All Application Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Totals...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TOTAL KPI DISPLAY METRIC */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total Applicants
            </p>
            <p className="text-5xl font-black text-slate-900 mt-2">
              {stats.total}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMN LEFT: GENDER & MARITAL BREAKDOWNS */}
            <div className="space-y-6">
              {/* Gender Summary Widget */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight border-b pb-2">
                  Gender Breakdown
                </h2>
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

              {/* Marital Summary Widget */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight border-b pb-2">
                  Marital Status Breakdown
                </h2>
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

            {/* COLUMN RIGHT: DISTRICT DISTRIBUTION ANALYSIS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 flex flex-col">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight">
                  District Distribution
                </h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {Object.keys(stats.districts).length} Registered Districts
                </span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[360px] pr-1 space-y-4">
                {Object.keys(stats.districts).length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-12">No district metrics returned.</p>
                ) : (
                  Object.entries(stats.districts)
                    .sort((a, b) => b[1] - a[1]) // Top volume first
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