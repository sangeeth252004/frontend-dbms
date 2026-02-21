import React, { useState, useEffect } from 'react';
import { disciplinaryAPI, studentsAPI } from '../services/api';

const DisciplinaryModal = ({ action, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    action_type: 'Warning',
    title: '',
    description: '',
    fine_amount: 0,
    action_date: new Date().toISOString().split('T')[0],
    status: 'Active',
    issued_by: '',
    remarks: '',
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchStudents();
    if (action) {
      setFormData({
        student_id: action.student_id || '',
        action_type: action.action_type || 'Warning',
        title: action.title || '',
        description: action.description || '',
        fine_amount: action.fine_amount || 0,
        action_date: action.action_date || new Date().toISOString().split('T')[0],
        status: action.status || 'Active',
        issued_by: action.issued_by || '',
        remarks: action.remarks || '',
      });
    }
  }, [action]);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
      setLoadingData(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (action) {
        await disciplinaryAPI.update(action.action_id, formData);
      } else {
        await disciplinaryAPI.create(formData);
      }
      onSave();
    } catch (error) {
      alert('Error saving disciplinary action: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{action ? 'Edit Disciplinary Action' : 'New Disciplinary Action'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student *</label>
            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
              disabled={!!action}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name} ({student.enrollment_number})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Action Type *</label>
            <select
              name="action_type"
              value={formData.action_type}
              onChange={handleChange}
              required
            >
              <option value="Warning">Warning</option>
              <option value="Fine">Fine</option>
              <option value="Suspension">Suspension</option>
              <option value="Expulsion">Expulsion</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fine Amount (₹)</label>
            <input
              type="number"
              name="fine_amount"
              value={formData.fine_amount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Action Date *</label>
            <input
              type="date"
              name="action_date"
              value={formData.action_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Issued By</label>
            <input
              type="text"
              name="issued_by"
              value={formData.issued_by}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : action ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisciplinaryModal;


