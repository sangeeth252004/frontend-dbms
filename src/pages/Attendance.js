import React, { useState, useEffect, useCallback } from 'react';
import { attendanceAPI } from '../services/api';
import AttendanceModal from '../components/AttendanceModal';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await attendanceAPI.getByDate(filterDate);
      setAttendance(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    fetchAttendance();
    handleModalClose();
  };

  const getStatusBadge = (status) => {
    const badges = {
      Present: 'badge-success',
      Absent: 'badge-danger',
      'Late Entry': 'badge-warning',
      'Early Exit': 'badge-warning',
    };
    return <span className={`badge ${badges[status] || 'badge-secondary'}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading attendance...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Attendance</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <button className="btn btn-primary" onClick={handleCreate}>
            + Record Entry
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
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No attendance records found for this date.
                </td>
              </tr>
            ) : (
              attendance.map((record) => (
                <tr key={record.attendance_id}>
                  <td>{record.student_name}</td>
                  <td>{record.enrollment_number}</td>
                  <td>{record.room_number || '-'}</td>
                  <td>{new Date(record.entry_time).toLocaleString()}</td>
                  <td>{record.exit_time ? new Date(record.exit_time).toLocaleString() : '-'}</td>
                  <td>{getStatusBadge(record.status)}</td>
                  <td>{record.remarks || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AttendanceModal
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Attendance;



