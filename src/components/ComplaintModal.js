import React, { useState, useEffect } from 'react';
import { complaintsAPI, studentsAPI, roomsAPI } from '../services/api';

const ComplaintModal = ({ complaint, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    room_id: '',
    complaint_type: 'Room Issue',
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    resolution_notes: '',
  });

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
    if (complaint) {
      setFormData({
        student_id: complaint.student_id || '',
        room_id: complaint.room_id || '',
        complaint_type: complaint.complaint_type || 'Room Issue',
        title: complaint.title || '',
        description: complaint.description || '',
        priority: complaint.priority || 'Medium',
        status: complaint.status || 'Pending',
        resolution_notes: complaint.resolution_notes || '',
      });
    }
  }, [complaint]);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (complaint) {
        await complaintsAPI.update(complaint.complaint_id, formData);
      } else {
        await complaintsAPI.create(formData);
      }
      onSave();
    } catch (error) {
      alert('Error saving complaint: ' + (error.response?.data?.error || error.message));
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
          <h2>{complaint ? 'View/Edit Complaint' : 'New Complaint'}</h2>
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
              disabled={!!complaint}
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
            <label>Complaint Type *</label>
            <select
              name="complaint_type"
              value={formData.complaint_type}
              onChange={handleChange}
              required
              disabled={!!complaint}
            >
              <option value="Room Issue">Room Issue</option>
              <option value="Facility Issue">Facility Issue</option>
              <option value="Food Quality">Food Quality</option>
              <option value="Security">Security</option>
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
              disabled={!!complaint}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={!!complaint}
            />
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

          {complaint && (
            <>
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
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Resolution Notes</label>
                <textarea
                  name="resolution_notes"
                  value={formData.resolution_notes}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : complaint ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;



