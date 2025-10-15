import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // adjust if needed

const HajjDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    gender: {},
    district: {},
    maritalStatus: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hajjApplicants"));
      const data = querySnapshot.docs.map((doc) => doc.data());

      const districtCount = {};
      const genderCount = {};
      const maritalCount = {};

      data.forEach((a) => {
        // Count by district (some may have multiple)
        if (Array.isArray(a.districts) && a.districts.length > 0) {
          a.districts.forEach((d) => {
            districtCount[d] = (districtCount[d] || 0) + 1;
          });
        }

        // Count by gender
        if (a.gender) {
          genderCount[a.gender] = (genderCount[a.gender] || 0) + 1;
        }

        // Count by marital status
        if (a.maritalStatus) {
          maritalCount[a.maritalStatus] = (maritalCount[a.maritalStatus] || 0) + 1;
        }
      });

      setStats({
        total: data.length,
        gender: genderCount,
        district: districtCount,
        maritalStatus: maritalCount,
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

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading dashboard...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* LEFT SIDE — District List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Applicants by District</h2>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">District</th>
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.district)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([district, count]) => (
                <tr key={district} className="border-t">
                  <td className="px-4 py-2">{district}</td>
                  <td className="px-4 py-2 font-semibold">{count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT SIDE — Other Stats */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Overview</h2>
        <p className="text-lg font-semibold mb-4">Total Applicants: {stats.total}</p>

        {/* Gender */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-700 mb-2">By Gender</h3>
          {Object.entries(stats.gender).map(([gender, count]) => (
            <p key={gender} className="ml-2">{gender}: {count}</p>
          ))}
        </div>

        {/* Marital Status */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-700 mb-2">By Marital Status</h3>
          {Object.entries(stats.maritalStatus).map(([status, count]) => (
            <p key={status} className="ml-2">{status}: {count}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HajjDashboard;
