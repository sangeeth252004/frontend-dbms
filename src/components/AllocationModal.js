import React, { useState, useEffect } from 'react';
import { allocationsAPI, studentsAPI, roomsAPI } from '../services/api';

const AllocationModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    room_id: '',
    allocation_date: new Date().toISOString().split('T')[0],
  });

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, roomsRes] = await Promise.all([
        studentsAPI.getAll(),
        roomsAPI.getAll(),
      ]);

      // Filter only available rooms
      const availableRooms = roomsRes.data.filter(r => 
        r.status === 'Available' || (r.status === 'Occupied' && (r.active_allocations || 0) < r.capacity)
      );

      setStudents(studentsRes.data);
      setRooms(availableRooms);
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
      await allocationsAPI.create(formData);
      onSave();
    } catch (error) {
      alert('Error creating allocation: ' + (error.response?.data?.error || error.message));
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
          <h2>Allocate Room</h2>
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
            <label>Room *</label>
            <select
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_number} - {room.room_type} (Capacity: {room.capacity}, Occupied: {room.active_allocations || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Allocation Date *</label>
            <input
              type="date"
              name="allocation_date"
              value={formData.allocation_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Allocating...' : 'Allocate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocationModal;


