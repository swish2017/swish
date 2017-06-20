import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NonIdealStateInvalidRoute } from '@swish/ui-components';
import {LoginPage} from './LoginPage';
import {SignupPage} from '../signup/SignupPage';
import {LoginHelpPage} from '../login-help/LoginHelpPage';
import {ResetPasswordPage} from '../reset-password/ResetPasswordPage';
import { Sf } from '@swish/ui-common';
const getSignupPage = (context: any) => {
    return <SignupPage/>;
};
const getLoginPage = (context: any) => {
    return <LoginPage/>;
};
const getResetPasswordPage = (context: any) => {
    const urlParams = Sf.nav.getQueryParams();
    let token;
    if (urlParams) {
        token = urlParams.token as string;
    }
    return <ResetPasswordPage token={token}/>;
};

const getLoginHelpPage = (context: any) => {
    return <LoginHelpPage/>;
};
const noRouteError = (context: any) => {
    return <NonIdealStateInvalidRoute route={context.location.pathname || ''} />;
};

export const CustomerWebLoginRoutes: React.SFC<void> = (props) => {
    return (
        <div className='sui-page-content'>
            <Switch>
                <Route exact path='/customerlogin/signup' component={getSignupPage} />
                <Route exact path='/customerlogin' component={getLoginPage} />
                <Route exact path='/customerlogin/help' component={getLoginHelpPage} />
                <Route exact path='/customerlogin/reset-password' component={getResetPasswordPage} />
                <Route component={noRouteError} />
            </Switch>
        </div>
    );
};
