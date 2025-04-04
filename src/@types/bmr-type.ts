interface BmrType {
  data: dataProps;
}

type dataProps = {
  method: string;
  BMR: Array<ObjProps>;
};

type ObjProps = {
  id: string | React.SetStateAction<number>;
  utente: string;
  password?: string;
  weight: string;
  height: string;
  age: string;
};

interface CustomInputProps {
  data: Array<ObjProps>;
  type: string;
  id?: string;
  placeholder?: string;
  helperText?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type { 
  CustomInputProps, 
  ObjProps, 
  BmrType, 
  dataProps 
};
