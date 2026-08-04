import styles from './Login.module.css';
import Button from '../../../components/Button/Button.jsx'
import {Link} from 'react-router-dom';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");
    
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();

        if(username.trim() === "" || password.trim() === ""){
            toast.error('fill in all the fields')
            return;
        }

        const response = await fetch("http://localhost:4000/api/users/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();
       

        if(!response.ok){
            toast.error(data.message);
            return;
        }

        toast.success(data.message);
         localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", data.username);
        localStorage.setItem("role", data.role)
        if(data.role === "admin"){
            navigate("/admin");
        }else{
            navigate("/dashboard");
        }
    }

    return(
        <div className={styles.containerDiv}>
            <div className={styles.logincard}>
                <h1>Welcome Back</h1>
                <p>Login to continue</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)}/>
                    <input type='password' placeholder='Password' onChange={(e) => setpassword(e.target.value)}/>

                     <div className={styles.forgotPw}>
                        <Link to="/forgot-password">Forgot Password?</Link>
                     </div>

                    <Button type='submit' text="Log In" variant="toggleBtn" className={styles.subBtn}/>

                    <hr></hr>
                    <div className={styles.noAccount}>  
                        <p>Don't have an account? </p> <Link className={styles.signup} to="/Sign-Up"> Sign Up</Link>
                    </div>

                </form>

            </div>
        </div>
    );
}