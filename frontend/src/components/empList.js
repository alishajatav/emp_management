import React, { useEffect, useState } from 'react';
import apiClient from './apiClient';
import { Link } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import './empList.css';

const EmpList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('firstName'); 
    const [sortDirection, setSortDirection] = useState('asc'); 

    const employeesPerPage = 5;
    

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await apiClient.get('/employees');
                setEmployees(response.data);
                setFilteredEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                setError('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const sortAndFilterEmployees = () => {
            let data = [...employees];

            // Filter employees based on search term
            if (searchTerm.trim() !== '') {
                data = data.filter(emp =>
                    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Sort employees
            data.sort((a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];
                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            setFilteredEmployees(data);
            setCurrentPage(1); // Reset to first page when filter or sort changes
        };

        sortAndFilterEmployees();
    }, [searchTerm, employees, sortField, sortDirection]);

    const handleDelete = async (empID) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await apiClient.delete(`/employees/${empID}`);
                setEmployees(employees.filter(emp => emp.empID !== empID));
                alert('Employee deleted successfully');
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('Failed to delete employee');
            }
        }
    };

    // Pagination logic
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    return (
        <div>
            <NavBar />
            <h1>Employee List</h1>
            <div className="header">
            <Link to="/CreateEmployee" className="create-employee">
    Create Employee
</Link>

                <div className="sort-controls">
                    <label>
                        Sort by:
                        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                            <option value="empID">ID</option>
                            <option value="firstName">Name</option>
                            <option value="email">Email</option>
                            <option value="createdAt">Create Date</option>
                        </select>
                    </label>
                    <label>
                        Direction:
                        <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </label>
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>
    
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Unique ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile No</th>
                                <th>Designation</th>
                                <th>Gender</th>
                                <th>Course</th>
                                <th>Create Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEmployees.map((emp, index) => (
                                <tr key={index}>
                                    <td>{emp.empID}</td>
                                    <td>
                                        {emp.image && (
                                            <img 
                                                src={`http://localhost:5000/${emp.image}`} 
                                                alt={`${emp.firstName}'s profile`} 
                                                style={{ width: '50px', height: '50px' }} 
                                            />
                                        )}
                                    </td>
                                    <td>{emp.firstName}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.phone}</td>
                                    <td>{emp.designation}</td>
                                    <td>{emp.gender}</td>
                                    <td>{emp.course}</td>
                                    <td>{new Date(emp.createdAt).toLocaleString()}</td>
                                    <td>
                                        <a href={`/CreateEmployee/${emp.empID}`}>Edit</a>
                                        <button onClick={() => handleDelete(emp.empID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                   
                    <div className="pagination">
    <span 
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
        style={{ cursor: 'pointer', marginRight: '10px' }} // Always visible
    >
        Previous
    </span>
    {Array.from({ length: totalPages }, (_, index) => (
        <span 
            key={index + 1} 
            onClick={() => setCurrentPage(index + 1)} 
            className={currentPage === index + 1 ? 'active' : ''}
            style={{ cursor: 'pointer', margin: '0 5px' }}
        >
            {index + 1}
        </span>
    ))}
    <span 
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
        style={{ cursor: 'pointer', marginLeft: '10px' }} // Always visible
    >
        Next
    </span>
</div>
</>
            )}
        </div>
    );
};

export default EmpList;
