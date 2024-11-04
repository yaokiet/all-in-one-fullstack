import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManagerWFHRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [error, setError] = useState(null);

  // Dummy data for testing
  const dummyRequests = [
    {
      id: 240,
      employeeName: 'Derek Tan',
      date: '2024-10-30',
      status: 'Pending',
      reason: 'Need to focus on project deadlines',
      rejectionReason: null
    },
    {
      id: 241,
      employeeName: 'Sarah Lee',
      date: '2024-10-31',
      status: 'Approved',
      reason: 'Team meeting and planning session',
      rejectionReason: null
    },
    {
      id: 242,
      employeeName: 'John Smith',
      date: '2024-11-01',
      status: 'Rejected',
      reason: 'Important on-site meeting',
      rejectionReason: 'Physical presence required for client meeting'
    }
  ];

  useEffect(() => {
    // Simulating API call
    setRequests(dummyRequests);
  }, []);

  const filteredRequests = requests.filter(request => 
    request.status.toLowerCase() === activeTab.toLowerCase()
  );

  const handleEdit = (requestId) => {
    console.log('Edit request:', requestId);
    // Implement edit functionality here
  };

  const handleApprove = (requestId) => {
    console.log('Approve request:', requestId);
    // Implement approve functionality here
  };

  const handleReject = (requestId) => {
    console.log('Reject request:', requestId);
    // Implement reject functionality here
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Work From Home Requests</h1>
      </div>
      
      <div className="flex mb-4 space-x-2">
        {['Pending', 'Approved', 'Rejected'].map((tab) => (
          <motion.button
            key={tab}
            className={`px-4 py-2 rounded-md ${
              activeTab.toLowerCase() === tab.toLowerCase()
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Application ID: {request.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      request.status === 'Pending' ? 'bg-yellow-500' :
                      request.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>{request.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">👤</span>
                      <span>{request.employeeName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📝</span>
                      <span>Reason: {request.reason}</span>
                    </div>
                    {request.rejectionReason && (
                      <div className="flex items-center text-red-600">
                        <span className="mr-2">❌</span>
                        <span>Rejection Reason: {request.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                  {request.status === 'Pending' ? (
                    <>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => handleEdit(request.id)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}