import React, { useState, useEffect } from 'react'
import RequestCard from '@/components/requestCard'
import ApplyWFHModal from '@/components/ApplyWFHModal'

export default function ApplyWFH() {
  const [requests, setRequests] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('upcoming')

  useEffect(() => {
    // Simulating fetching data from the backend
    const fetchRequests = async () => {
      // Replace this with your actual API call
      const response = await fetch('/api/requests')
      const data = await response.json()
      setRequests(data)
    }

    fetchRequests()
  }, [])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmitRequest = (newRequest) => {
    // Here you would typically send the new request to your backend
    // For now, we'll just add it to the local state
    setRequests([...requests, { ...newRequest, id: Date.now(), status: 'Pending' }])
    closeModal()
  }

  const filteredRequests = requests.filter(request => {
    const requestDate = new Date(request.date)
    const today = new Date()
    return activeTab === 'upcoming' ? requestDate >= today : requestDate < today
  })

  // Dummy data for testing
  const dummyRequests = [
    {
      id: 1,
      type: 'Work From Home',
      status: 'Pending',
      date: '2024-10-20',
      time: 'AM',
      approvingManager: 'John Doe',
      recurrence: 'Weekly'
    },
    {
      id: 2,
      type: 'Work From Home',
      status: 'Approved',
      date: '2024-10-25',
      time: 'FULL',
      approvingManager: 'Jane Smith',
      recurrence: 'None'
    }
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work From Home Requests</h1>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex justify-center rounded-md border border-transparent bg-[#6C7BF2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5A68D2] focus:outline-none focus:ring-2 focus:ring-[#6C7BF2] focus:ring-offset-2"
        >
          New Request
        </button>
      </div>
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded-md ${activeTab === 'upcoming' ? 'bg-[#6C7BF2] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'past' ? 'bg-[#6C7BF2] text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>
      <div className="space-y-6">
        {dummyRequests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
      <ApplyWFHModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitRequest}
      />
    </div>
  )
}