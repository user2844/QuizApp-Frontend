import styles from "./SignUp.module.css";
import Button from "../../../components/Button/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignUp() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [matchpassword, setmatchpassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function createAccount(e) {
    e.preventDefault();

    if (
      username.trim() === "" ||
      password.trim() === "" ||
      matchpassword.trim() === "" ||
      email.trim() === ""
    ) {
      toast.error("fill in all fields");
      return;
    }

    if (password.trim() !== matchpassword.trim()) {
      toast.error("password did not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword: matchpassword,
        }),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        toast.success(`${data.username}, ${data.message}`);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.singupCard}>
        <div className={styles.heading}>
          <h1>Create account</h1>
        </div>

        <form onSubmit={createAccount} className={styles.form}>
          <input
            type="text"
            placeholder="Create username"
            onChange={(e) => setusername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Set password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            onChange={(e) => setmatchpassword(e.target.value)}
          />

          <Button
            type="submit"
            text="Create Account"
            variant="toggleBtn"
            className={styles.createButton}
          />

          <hr></hr>

          <div className={styles.haveAccount}>
            <p>Already have an account? </p>
            <Link to="/" className={styles.login}>
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
