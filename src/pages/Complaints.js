import React, { useState, useEffect } from 'react';
import { complaintsAPI } from '../services/api';
import ComplaintModal from '../components/ComplaintModal';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, resolved

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintsAPI.getAll();
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingComplaint(null);
    setShowModal(true);
  };

  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await complaintsAPI.delete(id);
        fetchComplaints();
      } catch (error) {
        alert('Error deleting complaint: ' + error.message);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingComplaint(null);
  };

  const handleModalSave = () => {
    fetchComplaints();
    handleModalClose();
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'badge-warning',
      'In Progress': 'badge-info',
      Resolved: 'badge-success',
      Rejected: 'badge-danger',
    };
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      Low: 'badge-secondary',
      Medium: 'badge-info',
      High: 'badge-warning',
      Urgent: 'badge-danger',
    };
    return <span className={`badge ${badges[priority] || 'badge-secondary'}`}>{priority}</span>;
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === 'pending') return complaint.status === 'Pending';
    if (filter === 'resolved') return complaint.status === 'Resolved';
    return true;
  });

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Complaints</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="btn btn-primary" onClick={handleCreate}>
            + New Complaint
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Room</th>
              <th>Type</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  No complaints found.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr key={complaint.complaint_id}>
                  <td>{complaint.complaint_id}</td>
                  <td>{complaint.student_name}</td>
                  <td>{complaint.room_number || '-'}</td>
                  <td>{complaint.complaint_type}</td>
                  <td>{complaint.title}</td>
                  <td>{getPriorityBadge(complaint.priority)}</td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td>{new Date(complaint.submitted_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(complaint)}
                      style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                    >
                      View/Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(complaint.complaint_id)}
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ComplaintModal
          complaint={editingComplaint}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Complaints;



