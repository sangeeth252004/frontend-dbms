import React, { useState, useEffect } from 'react';
import { maintenanceAPI } from '../services/api';
import MaintenanceModal from '../components/MaintenanceModal';

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await maintenanceAPI.getAll();
      setMaintenance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching maintenance:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMaintenance(null);
    setShowModal(true);
  };

  const handleEdit = (maintenanceItem) => {
    setEditingMaintenance(maintenanceItem);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await maintenanceAPI.delete(id);
        fetchMaintenance();
      } catch (error) {
        alert('Error deleting maintenance: ' + error.message);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingMaintenance(null);
  };

  const handleModalSave = () => {
    fetchMaintenance();
    handleModalClose();
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'badge-warning',
      'In Progress': 'badge-info',
      Completed: 'badge-success',
      Cancelled: 'badge-secondary',
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

  const filteredMaintenance = maintenance.filter((item) => {
    if (filter === 'pending') return item.status === 'Pending';
    if (filter === 'completed') return item.status === 'Completed';
    return true;
  });

  if (loading) {
    return <div className="loading">Loading maintenance records...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Maintenance Records</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="all">All Records</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-primary" onClick={handleCreate}>
            + New Request
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room</th>
              <th>Type</th>
              <th>Title</th>
              <th>Reported By</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Reported Date</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaintenance.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>
                  No maintenance records found.
                </td>
              </tr>
            ) : (
              filteredMaintenance.map((item) => (
                <tr key={item.maintenance_id}>
                  <td>{item.maintenance_id}</td>
                  <td>{item.room_number || '-'}</td>
                  <td>{item.maintenance_type}</td>
                  <td>{item.title}</td>
                  <td>{item.reported_by_name || '-'}</td>
                  <td>{getPriorityBadge(item.priority)}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td>{item.assigned_to || '-'}</td>
                  <td>{new Date(item.reported_date).toLocaleDateString()}</td>
                  <td>{item.cost > 0 ? `₹${item.cost}` : '-'}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(item)}
                      style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(item.maintenance_id)}
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
        <MaintenanceModal
          maintenance={editingMaintenance}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Maintenance;



