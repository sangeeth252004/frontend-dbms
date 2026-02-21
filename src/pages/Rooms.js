import React, { useState, useEffect } from 'react';
import { roomsAPI } from '../services/api';
import RoomModal from '../components/RoomModal';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomsAPI.delete(id);
        fetchRooms();
      } catch (error) {
        alert('Error deleting room: ' + error.message);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingRoom(null);
  };

  const handleModalSave = () => {
    fetchRooms();
    handleModalClose();
  };

  const getStatusBadge = (status) => {
    const badges = {
      Available: 'badge-success',
      Occupied: 'badge-info',
      Maintenance: 'badge-warning',
      Reserved: 'badge-secondary',
    };
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Rooms</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Add Room
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Floor</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Occupancy</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No rooms found. Add a new room to get started.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.room_id}>
                  <td>{room.room_number}</td>
                  <td>{room.floor || '-'}</td>
                  <td>{room.room_type}</td>
                  <td>{room.capacity}</td>
                  <td>{room.active_allocations || 0} / {room.capacity}</td>
                  <td>{getStatusBadge(room.status)}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(room)}
                      style={{ marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(room.room_id)}
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
        <RoomModal
          room={editingRoom}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Rooms;



