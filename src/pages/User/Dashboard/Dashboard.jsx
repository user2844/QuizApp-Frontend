import style from "./Dashboard.module.css";
import ProgressCircle from "../../../components/ProgressCircle/ProgressCircle.jsx";
import Button from "../../../components/Button/Button.jsx";
import ProfilePic from "../../../assets/images/ProfilePic.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Dashboard() {
  const topPlayers = [
    { username: "Pemba", score: 1200 },
    { username: "Sarah", score: 1150 },
    { username: "John", score: 1000 },
    { username: "Alice", score: 900 },
    { username: "Mike", score: 850 },
  ];

  const [score, setScore] = useState(0)
  const [percentage,setPercentage] = useState(0)


  const navigate = useNavigate();
  const username = localStorage.getItem("loggedInUser");

  useEffect(() => {
   const token = localStorage.getItem("token");
   
   if(!token) return;

   async function fetchLatestResult() {
      try {
        const response = await fetch(`http://localhost:4000/api/records`,{
          methodL: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if(response === 401){
          localStorage.removeItem("token");
          localStorage.removeItem("loggedInUser");

          navigate('/');
          return;
        }
        const data = await response.json();
        
        if(response.ok && data.result){
          setScore(data.result.score);
          setPercentage(data.result.percentage)
        }
      } catch (error) {
        console.error("Failed to fetch latest quiz result:", error);
      }
   }
   fetchLatestResult();
  }, []);


  return (
    <div className={style.mainWrapper}>      
      {/*this is the lowerbody div*/}
      <div className={style.bodyDiv}>

        {/*this div is for content*/}
        <div className={style.dashDiv}>
          <div className={style.profileDiv}>
            <div className={style.contextDiv}>
              <div className={style.contextHeader}>
                <h3>Welcome back, {username}. Let's beat your high score!</h3>
                <p>Keep sharpening your mind, one quiz at a time.</p>
              </div>
              <div className={style.contextBtn}>
                <Button text="Take Quiz" variant="toggleBtn" onClick={()=> navigate('/quiz')}/>
                <Button text="View History" variant="toggleBtn" />
                <Button text="Daily Challenge" variant="toggleBtn" />
              </div>
            </div>
            <div className={style.imgDiv}>
              <img src={ProfilePic}></img>
            </div>
          </div>
          <div className={style.leaderBoard}>
            <h3>Leaderboard</h3>
            {topPlayers.slice(0, 5).map((player, index) => (
              <div key={index} className={style.leadingPlayers}>
                <span>
                  #{index + 1} {player.username}
                </span>
                <span>{player.score}</span>
              </div>
            ))}
          </div>
          <div className={style.achievements}>
            <ProgressCircle 
            progress={percentage}
            score={score}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
