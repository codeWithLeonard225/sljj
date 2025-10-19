import React from "react";

const PaymentReminderPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Reminder
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Hello <span className="font-semibold">Mr Millah</span>,<br />
          I appreciate the opportunity to work with you on your website project.
          As of today, the payment for the completed project is still pending.
          Kindly process the remaining balance at your earliest convenience to
          finalize our agreement.
        </p>

      
    

        <p className="text-sm text-gray-400 mt-6">
          Thank you for your understanding and cooperation.
        </p>
      </div>
    </div>
  );
};

export default PaymentReminderPage;
