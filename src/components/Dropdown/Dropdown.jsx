import style from './Dropdown.module.css';

export default function Dropdown({
    value,
    onChange,
    options
}){

    return(
        <select
            value={value}
            onChange={onChange}
            className={style.dropdown}
        >
            <option value="">All Categories</option>
            {options.map(option => (
                <option
                    key={option}
                    value={option}
                    >
                        {option}
                    </option>
            ))}
        </select>
    )
}