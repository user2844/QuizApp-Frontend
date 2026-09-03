import style from "./Dropdown.module.css";

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
}) {
  return (
    <select value={value} onChange={onChange} className={style.dropdown}>
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
