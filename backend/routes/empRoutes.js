const express = require('express');
const multer = require('multer');
const path = require('path');
const { getAllEmployees, CreateEmployee, loginUser, register,editEmployee, deleteEmployee, getEmployeeById, verifyToken, checkEmailAndPhoneExists } = require('../controllers/empController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

router.get('/employees', verifyToken, getAllEmployees);

router.post('/login', loginUser);
router.post('/CreateEmployee', verifyToken,upload.single('image'),checkEmailAndPhoneExists,CreateEmployee);
router.put('/employees/:empId',verifyToken,upload.single('image'),checkEmailAndPhoneExists, editEmployee); 
router.get('/employees/:empId', verifyToken,getEmployeeById);
router.delete('/employees/:empID', verifyToken,deleteEmployee); 

module.exports = router;



