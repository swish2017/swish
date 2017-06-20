import * as React from 'react';
import {Image} from '@swish/ui-components';
import './SidePanelStyles.scss';

export interface SidePanelProps {
    panelImage?: string;
    panelText?: string;
}

export const SidePanel: React.SFC<SidePanelProps> = (props) => {
    return (
        <div className='sui-side-panel'>
            <div className='sui-center'>
                <Image src={props.panelImage} />
            </div>
            <p>
                {props.panelText}
            </p>
        </div>
    );
};
