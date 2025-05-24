import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { register } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'patient',
    admin_code: '',
    specialization: '',
    license_number: '',
    hospital_name: '',
    medical_history: '',
    insurance_number: '',
    birth_date: '',
    employee_id: '',
    department: '',
    doctor_id: '',
  });

  const [errors, setErrors] = useState({});
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      // Prepare form data, omitting empty optional fields
      const submitData = {};
      for (const [key, value] of Object.entries(formData)) {
        if (key === 'doctor_id') {
          if (value) submitData[key] = Number(value) || null;
        } else if (value !== '') {
          submitData[key] = value;
        }
      }
      console.log('Form data:', submitData); // Debug log
      await register(submitData);
      await signIn(formData.username, formData.password);
      navigate('/profile');
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object' && !errorData.detail) {
          setErrors(errorData);
        } else {
          setErrors({ general: errorData.detail || 'Registration failed' });
        }
        console.error('Registration error:', errorData); // Debug log
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
        console.error('Registration error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {errors.general && <p className="text-red-500 mb-4 text-center">{errors.general}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
          {formData.role === 'admin' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Admin Code</label>
              <input
                type="text"
                name="admin_code"
                value={formData.admin_code}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.admin_code && <p className="text-red-500 text-sm mt-1">{errors.admin_code}</p>}
            </div>
          )}
          {formData.role === 'doctor' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.license_number && <p className="text-red-500 text-sm mt-1">{errors.license_number}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Hospital Name</label>
                <input
                  type="text"
                  name="hospital_name"
                  value={formData.hospital_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.hospital_name && <p className="text-red-500 text-sm mt-1">{errors.hospital_name}</p>}
              </div>
            </>
          )}
          {formData.role === 'patient' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <textarea
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.medical_history && <p className="text-red-500 text-sm mt-1">{errors.medical_history}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Insurance Number</label>
                <input
                  type="text"
                  name="insurance_number"
                  value={formData.insurance_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.insurance_number && <p className="text-red-500 text-sm mt-1">{errors.insurance_number}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
              </div>
            </>
          )}
          {formData.role === 'staff' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.employee_id && <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Doctor ID</label>
                <input
                  type="text"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.doctor_id && <p className="text-red-500 text-sm mt-1">{errors.doctor_id}</p>}
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;