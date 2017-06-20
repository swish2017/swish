import * as React from 'react';
import {DataTable} from '@swish/ui-components';
export interface ReferralTableProps {
    title?: string;
    description?: string;
    columns?: any;
    rows?: any;
}

export const ReferralTable: React.SFC<ReferralTableProps> = (props) => {
    return (
        <div>
            <hr className='sui-hr'/>
            {
                props.title &&
                <h2 className='sui-center'>{props.title}</h2>
            }
            {
                props.description &&
                <h3 className='sui-center'>{props.description}</h3>
            }
            <div className='sui-grid'>
                <div className='sui-grid-row'>
                    <div className='sui-grid-col'>
                        <DataTable className='sui-referrals-list' columns={props.columns} rows={props.rows}  width='100%' />
                    </div>
                </div>
            </div>
        </div>
    );
};
