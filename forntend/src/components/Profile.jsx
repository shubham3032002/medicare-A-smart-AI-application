import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.first_name || user.username}!</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <p className="mb-2"><strong>Username:</strong> {user.username}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-2"><strong>Role:</strong> {user.role}</p>
        {user.role === 'admin' && user.profile && (
          <p className="mb-2"><strong>Admin Code:</strong> {user.profile.admin_code}</p>
        )}
        {user.role === 'doctor' && user.profile && (
          <>
            <p className="mb-2"><strong>Specialization:</strong> {user.profile.specialization}</p>
            <p className="mb-2"><strong>License Number:</strong> {user.profile.license_number}</p>
            <p className="mb-2"><strong>Hospital:</strong> {user.profile.hospital_name}</p>
          </>
        )}
        {user.role === 'patient' && user.profile && (
          <>
            <p className="mb-2"><strong>Medical History:</strong> {user.profile.medical_history || 'N/A'}</p>
            <p className="mb-2"><strong>Birth Date:</strong> {user.profile.birth_date || 'N/A'}</p>
            <p className="mb-2"><strong>Insurance Number:</strong> {user.profile.insurance_number || 'N/A'}</p>
          </>
        )}
        {user.role === 'staff' && user.profile && (
          <>
            <p className="mb-2"><strong>Employee ID:</strong> {user.profile.employee_id}</p>
            <p className="mb-2"><strong>Department:</strong> {user.profile.department}</p>
            <p className="mb-2"><strong>Doctor ID:</strong> {user.profile.doctor_id || 'N/A'}</p>
          </>
        )}
      </div>
      <button
        onClick={signOut}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;