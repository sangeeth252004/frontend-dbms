import React, { useState, useEffect } from 'react';
import { allocationsAPI, studentsAPI, roomsAPI } from '../services/api';
import AllocationModal from '../components/AllocationModal';

const Allocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const response = await allocationsAPI.getAll();
      setAllocations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching allocations:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleDeallocate = async (id) => {
    if (window.confirm('Are you sure you want to deallocate this room?')) {
      try {
        await allocationsAPI.deallocate(id, {});
        fetchAllocations();
      } catch (error) {
        alert('Error deallocating room: ' + error.message);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    fetchAllocations();
    handleModalClose();
  };

  const filteredAllocations = allocations.filter((allocation) => {
    if (filter === 'active') return allocation.status === 'Active';
    if (filter === 'inactive') return allocation.status === 'Inactive';
    return true;
  });

  if (loading) {
    return <div className="loading">Loading allocations...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Room Allocations</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="all">All Allocations</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Allocate Room
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Enrollment No.</th>
              <th>Room</th>
              <th>Floor</th>
              <th>Type</th>
              <th>Allocation Date</th>
              <th>Deallocation Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  No allocations found.
                </td>
              </tr>
            ) : (
              filteredAllocations.map((allocation) => (
                <tr key={allocation.allocation_id}>
                  <td>{allocation.student_name}</td>
                  <td>{allocation.enrollment_number}</td>
                  <td>{allocation.room_number}</td>
                  <td>{allocation.floor || '-'}</td>
                  <td>{allocation.room_type}</td>
                  <td>{new Date(allocation.allocation_date).toLocaleDateString()}</td>
                  <td>{allocation.deallocation_date ? new Date(allocation.deallocation_date).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge ${allocation.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                      {allocation.status}
                    </span>
                  </td>
                  <td>
                    {allocation.status === 'Active' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeallocate(allocation.allocation_id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        Deallocate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AllocationModal
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Allocations;


