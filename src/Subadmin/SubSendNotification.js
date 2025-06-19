import React, { useState } from "react";
import Subsidebar from "./Subsidebar";

const SubSendNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = "YOUR_FCM_DEVICE_TOKEN"; // Replace with actual FCM token
  const senderId = "682585e376c2ffba4e20b055";
  const receiverId = "6800aacf1f93d96b69ebe659";

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and Message are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://tracking-backend-admin.vercel.app/v1/common/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId,
          receiverId,
          senderUserType: "subAdmin",
          receiverUserType: "User",
          title,
          message,
          notificationType: "General",
          token
        })
      });

      const result = await res.json();
      setLoading(false);

      if (result.success) {
        alert("✅ Notification Sent!");
        setTitle("");
        setMessage("");
      } else {
        alert("❌ Failed: " + result.error);
      }
    } catch (err) {
      setLoading(false);
      alert("❌ Error sending notification.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 bg-gray-800 shadow-md z-50 flex items-center gap-4 justify-start sticky top-0">
  <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
    <i className="bi bi-list text-3xl"></i>
  </button>
  <h2 className="text-white text-lg font-semibold">Tracking App</h2>
</div>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 transform top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out bg-gray-800 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Subsidebar />
      </div>
{/* Full-Screen Modal Content */}
<div className="flex-1 overflow-auto bg-gray-900 h-full w-full p-4 sm:p-8">
  <div className="max-w-4xl mx-auto py-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">
        📢 Send Notifications
      </h2>
    </div>

    {/* Input Fields */}
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-200">Title</label>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-3 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          placeholder="Enter notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">Message</label>
        <textarea
          rows={6}
          className="mt-1 block w-full border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-3 text-sm sm:text-base resize-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
    </div>

    {/* Button */}
    <div className="mt-8 flex justify-end">
      <button
        onClick={handleSend}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white font-medium transition text-sm sm:text-base ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Sending..." : "Send Notification"}
      </button>
    </div>
  </div>
</div>

    </div>
  );
};

export default SubSendNotification;
