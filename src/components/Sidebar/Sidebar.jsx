import { Link } from "react-router-dom";
import style from "./Sidebar.module.css";
import {
  FiHome,
  FiFileText,
  FiClock,
  FiSettings,
  FiLogOut,
  FiX
} from "react-icons/fi";

const userMenu =[
  {
    name: "Home",
    icon: FiHome,
    path: "/dashboard"
  },
  {
    name: "Take Quiz",
    path: "/quiz",
    icon: FiFileText
  },
  {
    name: "History",
    path: "/history",
    icon: FiClock
  },
  {
    name: "Setting",
    path: "/setting",
    icon: FiSettings,
  },
]

const adminMenu =[ 
  {
    name: "Dashboard",
    path: "/admin",
    icon: FiHome,
  },
  {
    name: "Manage Questions",
    path: "/admin/questions",
    icon: FiFileText
  },
  {
    name: "Manage Categories",
    path:"/admin/categories",
    icon: FiSettings,
  },
  {
    name: "Statistics",
    path: "/admin/statistics",
    icon: FiClock
  }
]


export default function Sidebar({
  role,
  onLogoutClick,
  sidebarOpen,
  setSidebarOpen,
}) {

  //Choose which menu to display 
  const menu = role === "admin" ? adminMenu: userMenu;

  return (
    <>
      {sidebarOpen && (
        <div className={style.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${style.sidebar} ${sidebarOpen ? style.open : ""}`}>
        {/* close button only for mobile */}
        <button
          className={style.closeBtn}
          onClick={() => setSidebarOpen(false)}>
            <FiX size={22} />
        </button>
        
        {/* Menu Items*/}
        {menu.map((item) => {
          const Icon = item.icon;

          return(
            <Link
             key ={item.path}
             to ={item.path}
             className= {style.sidebarItem}
             onClick={() => setSidebarOpen(false)}
             >
              <Icon size={20}/>
              <span>{item.name}</span>
              </Link>
          )
        })}

        {/*Logout Button*/}
        <div className={style.sidebarItem} onClick={onLogoutClick}>
          <FiLogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </>
  );
}
