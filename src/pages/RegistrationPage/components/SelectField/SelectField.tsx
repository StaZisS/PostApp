interface SelectFieldProps {
    id: string;
    label: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLSelectElement>) => void;
    options: { objectId: string; text: string }[];
    touched: boolean;
    error: string;
}

const SelectField = ({
                         id,
                         label,
                         name,
                         value,
                         onChange,
                         onBlur,
                         options,
                         touched,
                         error,
                     }: SelectFieldProps) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        >
            <option value="" label="Select Address"></option>
            {options.map((field, index) => (
                <option key={index} value={field.objectId}>
                    {field.text}
                </option>
            ))}
        </select>
        {touched && error && <div>{error}</div>}
    </div>
);

export default SelectField;
