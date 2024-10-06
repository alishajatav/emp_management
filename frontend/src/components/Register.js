import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        Sno: '',
        UserName: '',
        password: ''
    });

    const { Sno, UserName, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/register', formData);
            alert(res.data.message);
        } catch (error) {
            alert('Error: ' + error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <input type="text" name="Sno" value={Sno} onChange={onChange} placeholder="Sno" required /><br />
                <input type="text" name="UserName" value={UserName} onChange={onChange} placeholder="Username" required /><br />
                <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required /><br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
