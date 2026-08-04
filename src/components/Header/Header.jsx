import style from "./Header.module.css";
import ProfilePic from "../../assets/images/ProfilePic.jpg";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";
import Button from "../Button/Button";

export default function Header({ setSidebarOpen }) {
  return (
    <div className={style.header}>
      <div className={style.lefthead}>
        <h3>Quiz Web</h3>
        <Button text={<FiMenu size={22}/>} className={style.menuBtn} onClick={() => setSidebarOpen(true)}/>
      </div>

      <div className={style.righthead}>
        <FiSearch size={22} />
        <FiBell size={22} />

        <div className={style.profile}>
          <img src={ProfilePic} />
        </div>
      </div>
    </div>
  );
}
