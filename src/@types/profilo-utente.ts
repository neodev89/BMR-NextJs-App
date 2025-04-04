interface usersProps {
  data: Array<ObjUserProps>;
}

interface ObjUserProps {
  id: string;
  user: string;
  birth: string;
  bmr: Array<arrayBmrUserProps>;
}

interface arrayBmrUserProps {
  dateBmr: string;
  weight: string;
  height: string;
  age: string;
}

export type { usersProps, ObjUserProps, arrayBmrUserProps };
