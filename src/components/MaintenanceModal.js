import React, { useState, useEffect } from 'react';
import { maintenanceAPI, studentsAPI, roomsAPI } from '../services/api';

const MaintenanceModal = ({ maintenance, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    room_id: '',
    maintenance_type: 'Electrical',
    title: '',
    description: '',
    reported_by: '',
    priority: 'Medium',
    status: 'Pending',
    scheduled_date: '',
    completed_date: '',
    cost: 0,
    assigned_to: '',
    notes: '',
  });

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
    if (maintenance) {
      setFormData({
        room_id: maintenance.room_id || '',
        maintenance_type: maintenance.maintenance_type || 'Electrical',
        title: maintenance.title || '',
        description: maintenance.description || '',
        reported_by: maintenance.reported_by || '',
        priority: maintenance.priority || 'Medium',
        status: maintenance.status || 'Pending',
        scheduled_date: maintenance.scheduled_date ? maintenance.scheduled_date.split('T')[0] : '',
        completed_date: maintenance.completed_date ? maintenance.completed_date.split('T')[0] : '',
        cost: maintenance.cost || 0,
        assigned_to: maintenance.assigned_to || '',
        notes: maintenance.notes || '',
      });
    }
  }, [maintenance]);

  const fetchData = async () => {
    try {
      const [studentsRes, roomsRes] = await Promise.all([
        studentsAPI.getAll(),
        roomsAPI.getAll(),
      ]);
      setStudents(studentsRes.data);
      setRooms(roomsRes.data);
      setLoadingData(false);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      if (maintenance) {
        await maintenanceAPI.update(maintenance.maintenance_id, formData);
      } else {
        await maintenanceAPI.create(formData);
      }
      onSave();
    } catch (error) {
      alert('Error saving maintenance: ' + (error.response?.data?.error || error.message));
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
          <h2>{maintenance ? 'Edit Maintenance' : 'New Maintenance Request'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room</label>
            <select
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
            >
              <option value="">Select Room (Optional)</option>
              {rooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_number}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Maintenance Type *</label>
            <select
              name="maintenance_type"
              value={formData.maintenance_type}
              onChange={handleChange}
              required
            >
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
              <option value="Furniture">Furniture</option>
              <option value="Cleaning">Cleaning</option>
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
            <label>Reported By</label>
            <select
              name="reported_by"
              value={formData.reported_by}
              onChange={handleChange}
            >
              <option value="">Select Student (Optional)</option>
              {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name} ({student.enrollment_number})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Scheduled Date</label>
            <input
              type="date"
              name="scheduled_date"
              value={formData.scheduled_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Completed Date</label>
            <input
              type="date"
              name="completed_date"
              value={formData.completed_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Assigned To</label>
            <input
              type="text"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              placeholder="Staff name or department"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : maintenance ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;



