import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const ProtectedRoute = ({children})  => {
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
         toast.error("Please login.")
        }
    },[token])
    if(!token){
        return <Navigate to="/" replace/>
    }

    return children;
}

export default ProtectedRoute;