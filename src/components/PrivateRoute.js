// import React from 'react';
// import { Navigate } from 'react-router-dom';

// function PrivateRoute({ children, allowedRoles }) {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (!token || (allowedRoles && !allowedRoles.includes(role))) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// }

// export default PrivateRoute;