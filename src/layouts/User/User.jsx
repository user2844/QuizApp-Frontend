import style from './User.module.css';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx'
import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import { useState, useEffect } from 'react';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import { useNavigate } from 'react-router-dom';

export default function UserLayout(){

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
      document.body.style.overflow = 
      sidebarOpen ? "hidden" : "auto";
    }, [sidebarOpen]);

    
    return(
         <div className={style.mainWrapper}> 
                <Header setSidebarOpen={setSidebarOpen}/>

             <div className={style.bodyDiv}>
                <Sidebar 
                role="user"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                onLogoutClick={() => setShowLogoutModal(true)}/>

                <Outlet/>
             </div>

             <ConfirmModal
                  isOpen={showLogoutModal}
                  title="Logout"
                  message="Do u want to Logout?"
                  onCancel={()=> setShowLogoutModal(false)}
                  onConfirm={ () =>{
                    const keyToRemove =['token', 'loggedInUser', 'role']

                    keyToRemove.forEach(key => {
                      localStorage.removeItem(key)
                    })
                    navigate('/')
                  }}
                 />
        </div>
    );
}
