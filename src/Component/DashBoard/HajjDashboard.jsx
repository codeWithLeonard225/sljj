import React, { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; 

const HajjDashboard = () => {
  const [allApplicants, setAllApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("ALL");

  // Fetch all documents once
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setAllApplicants(data);
    } catch (error) {
      console.error("Error fetching Hajj records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Extract unique available application years dynamically
  const availableYears = useMemo(() => {
    const yearsSet = new Set();
    allApplicants.forEach((a) => {
      if (a.applicationYear) {
        yearsSet.add(a.applicationYear.toString());
      }
    });
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [allApplicants]);

  // Dynamically compute stats whenever selectedYear or allApplicants changes
  const stats = useMemo(() => {
    const filtered = allApplicants.filter((item) => {
      if (selectedYear === "ALL") return true;
      return (item.applicationYear || "").toString() === selectedYear;
    });

    const districtCount = {};
    const genderCount = {};
    const maritalCount = {};

    let sCount = 0;
    let pCount = 0;
    let gCount = 0;

    filtered.forEach((a) => {
      const slh6Value = a.slh6 || "";

      // Series breakdown
      if (/^S/i.test(slh6Value)) {
        sCount++;
      } else if (/^P/i.test(slh6Value)) {
        pCount++;
      } else if (/^\d/.test(slh6Value)) {
        gCount++;
      }

      // District Normalization
      if (Array.isArray(a.districts) && a.districts.length > 0) {
        a.districts.forEach((d) => {
          if (d && typeof d === "string") {
            const normalizedD = d.trim().charAt(0).toUpperCase() + d.trim().slice(1).toLowerCase();
            districtCount[normalizedD] = (districtCount[normalizedD] || 0) + 1;
          }
        });
      }

      // Gender Normalization
      if (a.gender && typeof a.gender === "string") {
        const normalizedGender = a.gender.trim().charAt(0).toUpperCase() + a.gender.trim().slice(1).toLowerCase();
        genderCount[normalizedGender] = (genderCount[normalizedGender] || 0) + 1;
      }

      // Marital Status Normalization
      if (a.maritalStatus && typeof a.maritalStatus === "string") {
        const normalizedMarital = a.maritalStatus.trim().charAt(0).toUpperCase() + a.maritalStatus.trim().slice(1).toLowerCase();
        maritalCount[normalizedMarital] = (maritalCount[normalizedMarital] || 0) + 1;
      }
    });

    return {
      total: filtered.length,
      gender: genderCount,
      district: districtCount,
      maritalStatus: maritalCount,
      sSeries: sCount,
      pSeries: pCount,
      generalSeries: gCount,
    };
  }, [allApplicants, selectedYear]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
          Synchronizing Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-8">
      
      {/* HEADER & YEAR FILTER CONTROL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            HAJJ ANALYTICS DASHBOARD
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Presidential Hajj Taskforce Secretariat
          </p>
        </div>

        {/* Year Filter Dropdown */}
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

      {/* TOP STAT CARDS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Applicants</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-blue-50/60 p-5 rounded-2xl shadow-sm border border-blue-100">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">S-Series</p>
          <p className="text-3xl font-black text-blue-900 mt-2">{stats.sSeries}</p>
        </div>
        <div className="bg-emerald-50/60 p-5 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">P-Series</p>
          <p className="text-3xl font-black text-emerald-900 mt-2">{stats.pSeries}</p>
        </div>
        <div className="bg-orange-50/60 p-5 rounded-2xl shadow-sm border border-orange-100">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">General Series</p>
          <p className="text-3xl font-black text-orange-900 mt-2">{stats.generalSeries}</p>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN (2 COLS) — District Distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
              District Distribution
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {Object.keys(stats.district).length} Districts
            </span>
          </div>

          {Object.keys(stats.district).length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No district data available for this selection.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.district)
                .sort((a, b) => b[1] - a[1]) // Sort highest count first
                .map(([district, count]) => {
                  const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                  return (
                    <div key={district} className="space-y-1">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-700">{district}</span>
                        <span className="text-slate-900 font-bold">{count} <span className="text-xs font-normal text-slate-400">({percentage}%)</span></span>
                      </div>
                      {/* Visual progress bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (1 COL) — Demographic Breakdown */}
        <div className="space-y-6">

          {/* Gender Stats Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight mb-4">
              By Gender
            </h2>
            {Object.keys(stats.gender).length === 0 ? (
              <p className="text-sm text-slate-400">No data available.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.gender).map(([gender, count]) => {
                  const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                  return (
                    <div key={gender} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{gender}</span>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 block">{count}</span>
                        <span className="text-[10px] font-semibold text-slate-400">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Marital Status Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-md font-bold text-slate-800 uppercase tracking-tight mb-4">
              By Marital Status
            </h2>
            {Object.keys(stats.maritalStatus).length === 0 ? (
              <p className="text-sm text-slate-400">No data available.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.maritalStatus).map(([status, count]) => {
                  const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;
                  return (
                    <div key={status} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{status}</span>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 block">{count}</span>
                        <span className="text-[10px] font-semibold text-slate-400">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default HajjDashboard;