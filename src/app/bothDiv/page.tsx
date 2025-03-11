import "./bothDiv.sass";
import { ReactElement } from 'react';

interface elementDiv {
    children: ReactElement;
}

export const OneDiv = ({ children }: elementDiv) => {

    return (
        <div className='principal'>
            <div className="second">
                { children }
            </div>
        </div>
    )
}