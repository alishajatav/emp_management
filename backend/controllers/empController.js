const EMP = require('../models/emp');
const jwt = require('jsonwebtoken');
const LOGIN =require('../models/Logint')
//const bcrypt = require('bcryptjs'); 

// Function to get the next employee ID
const getNextEmpID = async () => {
    const lastEmp = await EMP.findOne().sort({ empID: -1 }).select('empID');
    return lastEmp ? lastEmp.empID + 1 : 1; // Start from 1 if no employees exist
};
exports.checkEmailAndPhoneExists = async (req, res, next) => {
    console.log("checkEmailAndPhoneExists ");
    const { firstName, phone, email, designation, gender, course} = req.body;
    console.log(req.body)
    if (!firstName || !phone || !email || !designation || !gender || !course ) {
        console.log("checkEmailAndPhoneExists !empID || !firstName || !phone || !email || !designation || !gender || !course ");
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        console.log("checkEmailAndPhoneExists try block");
        const existingEmployee = await EMP.findOne({ 
            $or: [{ email }, { phone }],
        });
        const empID = req.params.empId ? Number(req.params.empId) : undefined; 
        if ((existingEmployee &&  !empID ) || (empID && existingEmployee.empID !== empID)) {
            return res.status(400).json({ 
                 email: existingEmployee.email === email,
                 phone: existingEmployee.phone === phone
            });
        }

        next(); 
    } catch (error) {
        console.error("Error checking email and phone:", error);
        return res.status(500).json({ message: error.message });
    }
};


exports.CreateEmployee = async (req, res) => {
    
    const { firstName, phone, email, designation, gender, course } = req.body;
    const image = req.file; // Access the uploaded file
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", image);
    try {
        
        const empID = await getNextEmpID(); // Generate unique empID
        const emp = new EMP({
            empID, firstName, phone, email, designation, gender, course, image: image ? image.path : null
        });
        await emp.save();
        res.status(201).json(emp);
    } catch (error) {
        console.error("Create Employee Error:", error);
        res.status(400).json({ message: error});
    }
};




// Login User
exports.loginUser = async (req, res) => {
    console.log("===================================1")
    const { UserName, password } = req.body;
    console.log(req.body)
    if (!UserName || (!password )) {
        return res.status(400).json({ message: 'UserName and either password or OTP are required' });
    }
    if (password) {
        const user = await LOGIN.findOne({ UserName });
        console.log(user)
        if (!user) {
            console.log("======================if")
            return res.status(400).json({ message: 'User not found' });
        }

        
        if (password!==user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ UserName: UserName }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    }
};

// Get All Employees
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await EMP.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }1
};

// Edit Employee
exports.editEmployee = async (req, res) => {
    const empID = Number(req.params.empId);
    console.log(empID);
    
    // Use req.body for other fields
    const updatedData = req.body;
    console.log(updatedData);
    
    
    if (req.file) {
        updatedData.image = req.file.path; 
    }

    try {
        const updatedEmp = await EMP.findOneAndUpdate({ empID }, updatedData, { new: true });
        if (!updatedEmp) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(updatedEmp);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
    const empID = Number(req.params.empID);
    try {
        const deletedEmp = await EMP.findOneAndDelete({ empID });
        if (!deletedEmp) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    console.log("getempbyid");
    console.log("Request Params:", req.params); 

  
    const empID = Number(req.params.empId); // Use empId as the parameter name in the route
    console.log(empID);

    // Validate empID
    if (!empID || isNaN(empID)) {
        console.log("Invalid empID");
        return res.status(400).json({ message: 'Invalid or missing employee ID' });
    }

    try {
        console.log("Try Block");
        console.log("empID:", empID); // Log empID value
        const emp = await EMP.findOne({ empID }); // Use empID in the query

        console.log("Found Employee:", emp);
        if (!emp) {
            console.log("Employee not found");
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(emp);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: error.message });
    }
};

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.sendStatus(403); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, employee) => {
        if (err) {
            return res.sendStatus(403); 
        }
        req.employee = employee;
        next();
    });
};

// Export the middleware separately
module.exports = {
    verifyToken,
    ...exports 
};
