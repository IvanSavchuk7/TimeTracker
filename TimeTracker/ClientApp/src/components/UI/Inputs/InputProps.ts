export interface InputProps {
    isDisabled?: boolean
}

export interface TextInputProps extends InputProps{
    name: string;
    placeholder: string;
    register?: any;
    errors?: any;
}

export interface SearchInputProps extends TextInputProps {
    onSearch: any;
    onChangeAdditional?:( e:React.ChangeEvent<HTMLInputElement>)=>void
}

export interface CheckboxInputProps {
    title: string,
    options: any[],
    values: any,
    register: any,
    selected: number,
    isMultipleChoice: boolean,
    setSelected: (value: number ) => void
}

export interface RangeInputProps {
    title : string,
    minRange: number,
    maxRange: number,
    step: number,
    value: number,
    onChange: any;
}