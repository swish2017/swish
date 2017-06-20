import * as React from 'react';
import { FormErrors } from '@swish/ui-components';
import { Utils, App } from '@swish/ui-components';
import {BasePageWeb} from '../app/BasePageWeb';
import {BrowserRouter} from 'react-router-dom';
import {RoutingAgent} from '@swish/ui-common';
import { CustomerWebSignupRoutes } from './CustomerWebSignupRoutes';

export interface CustomerWebSignupState {
    loading ?: boolean;
    errors ?: FormErrors;
}


export class CustomerWebSignup extends BasePageWeb<{}, CustomerWebSignupState> {

    constructor(props: any) {
        super(props);
    }

    public static init() {
        Utils.render(<CustomerWebSignup/>, 'spa-content');
        Utils.showSpaContent();
    }

    public render() {
        const state = this.state;

        if (state.loading) {
            return null;
        }

        return (
            <BrowserRouter>
                <App name='app-web'>
                    <RoutingAgent/>
                    <CustomerWebSignupRoutes/>
                </App>
            </BrowserRouter>
        );
    }
}
