import * as React from 'react';
import { FormErrors } from '@swish/ui-components';
import { Utils, App } from '@swish/ui-components';
import {BasePageWeb} from '../app/BasePageWeb';
import './CustomerWebLoginStyles.scss';
import {BrowserRouter} from 'react-router-dom';
import {RoutingAgent} from '@swish/ui-common';
import { CustomerWebLoginRoutes } from './CustomerWebLoginRoutes';

export interface CustomerWebLoginState {
    loading ?: boolean;
    errors ?: FormErrors;
}


export class CustomerWebLogin extends BasePageWeb<{}, CustomerWebLoginState> {

    constructor(props: any) {
        super(props);
    }

    public static init() {
        Utils.render(<CustomerWebLogin/>, 'spa-content');
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
                    <CustomerWebLoginRoutes/>
                </App>
            </BrowserRouter>
        );
    }
}
