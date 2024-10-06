import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from './apiClient'; // Adjust the path as necessary
import NavBar from '../navbar/NavBar';

import './CreateEmployee.css';

const CreateEmployee = () => {
  
    const { empId } = useParams();
    useEffect(() => {
        if(empId) { 
            const fetchEmployee = async () => {
                try {
                    const response = await apiClient.get(`/employees/${empId}`);
                    console.log(response)
                    setFormData({
                        firstName: response.data.firstName || '',
                        phone: response.data.phone || '',
                        email: response.data.email || '',
                        designation: response.data.designation || '',
                        gender: response.data.gender || '',
                        course: response.data.course || '',
                        image: null,
                    });
                } catch (error) {
                    console.error('Error fetching employee:', error);
                   
                } 
            };
    
            fetchEmployee();
        }
    }, [empId]);
    
    const [formData, setFormData] = useState({
        firstName: '',
        phone: '',
        email: '',
        designation: '',
        gender: '',
        course: '',
        image: null,
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('Handle Change');
        setFormData({ ...formData, [name]: value });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));

        if (name === 'email' && !validateEmail(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Invalid email format',
            }));
        }

        if (name === 'phone' && !validatePhone(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phone: 'Phone number must be 10 digits',
            }));
        }
    };

    const validateEmail = (email) => {
        console.log('Valid email');
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhone = (phone) => {
        console.log('Valid phone');
        const regex = /^\d{10}$/; // Adjust the regex based on your required format
        return regex.test(phone);
    };

    const validateForm = () => {
        console.log('Valid form');
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'This field is required';
        if (!formData.phone) newErrors.phone = 'This field is required';
        if (!formData.email) newErrors.email = 'This field is required';
        if (!formData.designation) newErrors.designation = 'This field is required';
        if (!formData.gender) newErrors.gender = 'This field is required';
        if (!formData.course) newErrors.course = 'This field is required';
        return newErrors;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevFormData) => ({
                ...prevFormData, 
                image: file, 
            }));
        }
    };

    const handleSubmit = async (e) => {
        console.log('Handle Submit');
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formDataToSubmit = new FormData();
        for (const key in formData) {
            formDataToSubmit.append(key, formData[key]);
            console.log('formData to Submit');
        }

        try {
            if(empId) { 
                await apiClient.put(`/employees/${empId}`, formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } 
            else { 
                await apiClient.post('/CreateEmployee', formDataToSubmit, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            alert('Employee created successfully');
            navigate('/EmpList');
            // Reset the form
            setFormData({
                firstName: '',
                phone: '',
                email: '',
                designation: '',
                gender: '',
                course: '',
                image: null,
            });
            setErrors({});
        } catch (error) {
            console.error('Error during creation', error.response.data)
            //alert(error.response.data.message);
            const newErrors = {};
            if (error.response.data.phone) 
                newErrors.phone = 'Phone already exits';
            if (error.response.data.email)
                newErrors.email = 'email already exits';
            setErrors(newErrors)
        }
    };

    return (
        <>
            <NavBar /> 
        <form onSubmit={handleSubmit}>
     
            <h2>Create Employee</h2>
            <div className="form-group">
                    <label>First Name</label>
                    <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                    />
                    {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label>Designation</label>
                    <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                    >
                        <option value="">Select Designation</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                    {errors.designation && <span className="error">{errors.designation}</span>}
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <div className="gender-options" >
                        <label>
                            Male <input type="radio" name="gender" value="Male" onChange={handleChange} checked={formData.gender === "Male"}/>
                        </label>
                        <label>
                            Female <input type="radio" name="gender" value="Female" onChange={handleChange}  checked={formData.gender === "Female"}/>
                        </label>
                    </div>
                    {errors.gender && <span className="error">{errors.gender}</span>}
                </div>

                <div className="form-group">
                    <label>Course</label>
                    <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                    >
                        <option value="">Select Course</option>
                        <option value="MCA">MCA</option>
                        <option value="BCA">BCA</option>
                        <option value="BSC">BSC</option>
                    </select>
                    {errors.course && <span className="error">{errors.course}</span>}
                </div>

                <div className="form-group">
                    <label>Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {formData.image && (
                <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Uploaded Preview"
                    style={{ marginLeft: '20px', maxHeight: '100px', maxWidth: '100px' }}
                />
            )}
                </div>

            <button type="submit">Register</button>
        </form>
        </>
    );
};

export default CreateEmployee;
