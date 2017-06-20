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
import { CustomerWebComponentFactory } from '../app/CustomerWebComponentFactory';
import { CustomerWebPage } from '../../components/pages/CustomerWebPage';
const loginLayout = require('./HomePagelayout.json');
export interface HomePageState {
    layout ?: PageLayout;
    initProcessing ?: boolean;
    errors ?: FormErrors;
    model ?: Object;
}

class HomePageModel {
    public login: LoginRequest;
}

export class HomePage extends BasePageWeb<{}, HomePageState> {

    constructor(props: any) {
        super(props, {initProcessing: true, model: {}});
    }

    public static init() {
        Utils.render(<HomePage/>, 'spa-content');
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
            <CustomerWebPage >
                    Home
                    {/*<PageLayoutRenderer2
                        componentFactory={factory}
                        errors={state.errors}
                        object='na'
                        mode='edit'
                        metadata={new Metadata()}
                        layout={state.layout as PageLayout}
                        value={state.model}
                    />*/}
            </CustomerWebPage >
        );
    }


}
