import React, { useState, useEffect } from 'react';
import { disciplinaryAPI } from '../services/api';
import DisciplinaryModal from '../components/DisciplinaryModal';

const Disciplinary = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, resolved

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await disciplinaryAPI.getAll();
      setActions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching disciplinary actions:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAction(null);
    setShowModal(true);
  };

  const handleEdit = (action) => {
    setEditingAction(action);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this disciplinary action?')) {
      try {
        await disciplinaryAPI.delete(id);
        fetchActions();
      } catch (error) {
        alert('Error deleting action: ' + error.message);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAction(null);
  };

  const handleModalSave = () => {
    fetchActions();
    handleModalClose();
  };

  const getStatusBadge = (status) => {
    const badges = {
      Active: 'badge-warning',
      Resolved: 'badge-success',
      Cancelled: 'badge-secondary',
    };
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{status}</span>;
  };

  const filteredActions = actions.filter((action) => {
    if (filter === 'active') return action.status === 'Active';
    if (filter === 'resolved') return action.status === 'Resolved';
    return true;
  });

  if (loading) {
    return <div className="loading">Loading disciplinary actions...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Disciplinary Actions</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="all">All Actions</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="btn btn-primary" onClick={handleCreate}>
            + New Action
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Enrollment No.</th>
              <th>Action Type</th>
              <th>Title</th>
              <th>Fine Amount</th>
              <th>Action Date</th>
              <th>Status</th>
              <th>Issued By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActions.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                  No disciplinary actions found.
                </td>
              </tr>
            ) : (
              filteredActions.map((action) => (
                <tr key={action.action_id}>
                  <td>{action.action_id}</td>
                  <td>{action.student_name}</td>
                  <td>{action.enrollment_number}</td>
                  <td>{action.action_type}</td>
                  <td>{action.title}</td>
                  <td>{action.fine_amount > 0 ? `₹${action.fine_amount}` : '-'}</td>
                  <td>{new Date(action.action_date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(action.status)}</td>
                  <td>{action.issued_by || '-'}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(action)}
                      style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(action.action_id)}
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
        <DisciplinaryModal
          action={editingAction}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Disciplinary;


