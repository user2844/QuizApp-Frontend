import { useEffect } from "react";
import {Navigate, replace } from "react-router-dom";
import {toast} from 'sonner';

export default function AdminProtectedRoute({children}){
    
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

   useEffect(() => {
    if(!token){
        toast.error(`Please login!`)
    }else if(role !== 'admin'){
        toast.error('Unauthorized! ')
    }
   }, [token,role])
    if(!token){
        return <Navigate to="/" replace/>;
    }

    if(role !== "admin"){
        return <Navigate to="/dashboard" replace/>
    }
   return children;

}