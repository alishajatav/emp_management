// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Home from './components/Home';
import Login from './components/Login';

import CreateEmployee from './components/CreateEmployee';
import EmpList from './components/empList';
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
    return (
         <AuthProvider>
         <Router>
             <Routes>
                 <Route path="/Home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
                 <Route path="/" element={<Login />} />
               
                 <Route path="/CreateEmployee" element={<ProtectedRoute><CreateEmployee/></ProtectedRoute> } />
                 <Route path="/CreateEmployee/:empId" element={<ProtectedRoute><CreateEmployee/></ProtectedRoute> } />
                 <Route 
                     path="/EmpList" 
                     element={
                        <ProtectedRoute>
                             <EmpList/>
                        </ProtectedRoute>
                     } 
                 />
             </Routes>
         </Router>
     </AuthProvider>
    );
};

export default App;

