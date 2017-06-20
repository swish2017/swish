import * as React from 'react';
import * as classNames from 'classnames';
import './CustomerWebPageStyles.scss';

export interface CustomerWebPageProps {
    className?: string;
    title?: string;
    description?: string;
}

export const CustomerWebPage: React.SFC<CustomerWebPageProps> = (props) => {
    return (
        <div className={classNames('sui-customer-page', props.className)}>
            {
                props.title
                &&
                <h2>{props.title}</h2>
            }
            {
                props.description
                &&
                <p>{props.description}</p>
            }
            {props.children}
        </div>
    );
};
