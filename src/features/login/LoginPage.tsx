import * as React from 'react';
import { ErrorItem } from '@swish/ui-components';
import { FormErrors } from '@swish/ui-components';
import { LoginRequest } from '@swish/ui-common';
import { PageLayout } from '@swish/ui-components';
import { Metadata } from '@swish/ui-components';
import { Link } from '@swish/ui-components';
import { PageLayoutRenderer2 } from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
import { Utils, App } from '@swish/ui-components';
import { NonIdealStateLoading } from '@swish/ui-components';
import {BasePageWeb} from '../app/BasePageWeb';
import './LoginPageStyles.scss';
import { CustomerWebComponentFactory } from '../app/CustomerWebComponentFactory';
const loginLayout = require('./LoginPagelayout.json');
export interface LoginPageState {
    layout ?: PageLayout;
    initProcessing ?: boolean;
    errors ?: FormErrors;
    model ?: Object;
}

class LoginPageModel {
    public login: LoginRequest;
}

export class LoginPage extends BasePageWeb<{}, LoginPageState> {

    constructor(props: any) {
        super(props, {initProcessing: true, model: {}});
    }

    public static init() {
        Utils.render(<LoginPage/>, 'spa-content');
    }

    public componentDidMount = () => {
        Sf.metadata
            .getLoginPagelayout()
            .then((layout: any) => {
                layout = loginLayout;//need to remove
                this.setNewState({ layout: layout, initProcessing: false });
                Utils.showSpaContent();
            });
    }

    public render() {
        const state = this.state;
        const factory = new CustomerWebComponentFactory();
        if (state.initProcessing) {
            return <NonIdealStateLoading/>;
        }

        return (
            <App name='app-web-login'>
                <div className='login-form'>
                    <PageLayoutRenderer2
                        componentFactory={factory}
                        errors={state.errors}
                        object='na'
                        mode='edit'
                        metadata={new Metadata()}
                        layout={state.layout as PageLayout}
                        value={state.model}
                        onSubmitValid={this.handleSubmit}
                    />
                </div>
            </App>
        );
    }

    private handleSubmit = async (model: LoginPageModel) => {
        try {
            await Sf.authn.login(model.login);
            Sf.nav.redirect('/customer/home');
        } catch (error) {
            let message;
            if (error.error_code === 'authn.invalid_credentials') {
                message = 'Invalid Credentials';
            } else {
                message = 'Unexpected error while authenticating [' + error.error_code + ']';
            }
            this.setNewState({errors: {login: [new ErrorItem('', message)]}});
        }
    }

}
