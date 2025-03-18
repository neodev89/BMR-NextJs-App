import './CustomInputStyle.sass';

interface CustomInputProps {
    BMR: Array<ObjData>;
    type: string;
    id?: string;
    className?: string;
}

type ObjData = {
    name: string;
    value: string;
}

export const CustomInput = ({ BMR, type, ...other }: CustomInputProps) => {
    return (
        <div className="custom-input">
            { BMR.map((bmr, index) => {
                return (
                    <input
                        key={index}
                        type={type}
                        name={bmr.name}
                        value={bmr.value}
                        {...other}
                    />
                )
            })}
        </div>
    )
}