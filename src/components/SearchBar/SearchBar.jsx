import style from './SearchBar.module.css'
import { FiSearch } from 'react-icons/fi'


export default function SearchBar({
    value,
    onChange,
    placeholder="Search..."
}){

    return(
        <div className={style.searchContainer}>
           <FiSearch className={style.icon} />
            <input 
                type='text'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={style.input}
                />
                
        </div>
    );
}