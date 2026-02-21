import React, { useState, useEffect } from 'react';
import { roomsAPI } from '../services/api';

const RoomModal = ({ room, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    room_number: '',
    floor: '',
    capacity: 2,
    room_type: 'Double',
    status: 'Available',
    amenities: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        room_number: room.room_number || '',
        floor: room.floor || '',
        capacity: room.capacity || 2,
        room_type: room.room_type || 'Double',
        status: room.status || 'Available',
        amenities: room.amenities || '',
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (room) {
        await roomsAPI.update(room.room_id, formData);
      } else {
        await roomsAPI.create(formData);
      }
      onSave();
    } catch (error) {
      alert('Error saving room: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{room ? 'Edit Room' : 'Add New Room'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Number *</label>
            <input
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Floor</label>
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Capacity *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              max="10"
              required
            />
          </div>

          <div className="form-group">
            <label>Room Type *</label>
            <select
              name="room_type"
              value={formData.room_type}
              onChange={handleChange}
              required
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Quad">Quad</option>
            </select>
          </div>

          {room && (
            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Amenities</label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="e.g., AC, WiFi, Attached Bathroom"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : room ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;



