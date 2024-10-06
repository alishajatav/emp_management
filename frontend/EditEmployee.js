import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from './src/components/apiClient'; // Adjust the path as necessary

const EditEmployee = () => {
    const { empID } = useParams(); // Get the employee ID from the URL
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await apiClient.get(`/employees/${empID}`);
                console.log(response)
                setEmployeeData(response.data);
            } catch (error) {
                console.error('Error fetching employee:', error);
                setError('Failed to fetch employee');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [empID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put(`/edit/${empID}`, employeeData); // Send updated data to the backend
            alert('Employee updated successfully');
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Employee</h2>
            <input
                type="text"
                name="firstName"
                value={employeeData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
            />
            <input
                type="text"
                name="phone"
                value={employeeData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
            />
            <input
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <select name="designation" value={employeeData.designation} onChange={handleChange}>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
            </select>
            <div>
                <label>
                    Male <input type="radio" name="gender" value="Male" checked={employeeData.gender === 'Male'} onChange={handleChange} />
                </label>
                <label>
                    Female <input type="radio" name="gender" value="Female" checked={employeeData.gender === 'Female'} onChange={handleChange} />
                </label>
            </div>
            <select name="course" value={employeeData.course} onChange={handleChange}>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
                <option value="BSC">BSC</option>
            </select>
            <button type="submit">Update Employee</button>
        </form>
    );
};

export default EditEmployee;
