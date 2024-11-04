import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/modal';
// import { Router } from 'lucide-react';

export default function ManageArrangement() {
  const [arrangements, setArrangements] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArrangement, setSelectedArrangement] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Dummy data for testing
  const dummyArrangements = [
    {
      id: 240,
      date: '2024-10-30',
      status: 'Pending',
      reason: 'Need to focus on project deadlines',
      type: 'Work From Home'
    },
    {
      id: 241,
      date: '2024-10-31',
      status: 'Approved',
      reason: 'Team meeting and planning session',
      type: 'Work From Home'
    },
    {
      id: 242,
      date: '2024-11-01',
      status: 'Pending',
      reason: 'Doctor\'s appointment in the morning',
      type: 'Work From Home'
    },
    {
      id: 243,
      date: '2024-11-02',
      status: 'Approved',
      reason: 'Attending online conference',
      type: 'Work From Home'
    },
    {
      id: 244,
      date: '2024-11-03',
      status: 'Pending',
      reason: 'Family emergency',
      type: 'Work From Home'
    },
    {
      id: 245,
      date: '2024-11-04',
      status: 'Approved',
      reason: 'Collaborative project with remote team',
      type: 'Work From Home'
    }
  ];

  useEffect(() => {
    // Simulating API call
    setArrangements(dummyArrangements);
  }, []);

  const handleWithdraw = (arrangement) => {
    setSelectedArrangement(arrangement);
    setIsModalOpen(true);
  };

  const confirmWithdraw = async () => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the arrangement from the list
      setArrangements(arrangements.filter(arr => arr.id !== selectedArrangement.id));
      
      // Close modal and show success popup
      setIsModalOpen(false);
      setShowSuccessPopup(true);
      
      // Hide success popup after 3 seconds
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error('Error withdrawing arrangement:', error);
    }
  };

  const filteredArrangements = arrangements.filter(arrangement => 
    arrangement.status.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold">My Arrangements</h1>
      </div>
      
      <div className="flex mb-4 space-x-2">
        {['Pending', 'Approved'].map((tab) => (
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
          {filteredArrangements.map((arrangement, index) => (
            <motion.div
              key={arrangement.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Application ID: {arrangement.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      arrangement.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {arrangement.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>{arrangement.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🏠</span>
                      <span>{arrangement.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📝</span>
                      <span>Reason: {arrangement.reason}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={() => handleWithdraw(arrangement)}
                  >
                    Withdraw Request
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmWithdraw}
        title="Confirm Withdrawal"
        message="Are you sure you want to withdraw this request?"
        buttonMessage="Withdraw"
      />

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg"
          >
            Request successfully withdrawn!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}