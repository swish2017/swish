import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NonIdealStateInvalidRoute } from '@swish/ui-components';
import {SignupPage} from './SignupPage';
const getSignupPage = (context: any) => {
    return <SignupPage/>;
};

const noRouteError = (context: any) => {
    return <NonIdealStateInvalidRoute route={context.location.pathname || ''} />;
};

export const CustomerWebSignupRoutes: React.SFC<void> = (props) => {
    return (
        <div className='sui-page-content'>
            <Switch>
                <Route exact path='/customersignup' component={getSignupPage} />
                <Route component={noRouteError} />
            </Switch>
        </div>
    );
};
