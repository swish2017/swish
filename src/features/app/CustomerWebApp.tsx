import './CustomerWebAppStyles.scss';
import {App} from '@swish/ui-components';
import {BaseComponent, UIAction, Utils} from '@swish/ui-components';
import { BrowserRouter, Route } from 'react-router-dom';
import { RoutingAgent } from '@swish/ui-common';
import { StoreUtils } from '@swish/ui-common';
import { CustomerWebAppRoutes } from './CustomerWebAppRoutes';
import {NonIdealStateError} from '@swish/ui-components';
import { AppContext } from '@swish/ui-components';
import {NonIdealStateLoading} from '@swish/ui-components';
import { CustomerWebAppBar } from '../app/appbar/CustomerWebAppBar';
import { customerWebReducer } from '../../reducers/customerWebReducer';
import { CustomerWebAppSidebar } from './sidebar/CustomerWebAppSidebar';
import { SidebarWeb } from '@swish/ui-components/dist/components/sidebar';
import {Sf} from '@swish/ui-common';
import * as React from 'react';
import { Provider } from 'react-redux';


export interface CustomerWebAppState {
    initError: boolean;
    initProcessing: boolean;
}
const rootStore = Sf.store.initStore(customerWebReducer, {});
export class CustomerWebApp extends BaseComponent<void, CustomerWebAppState> {

    constructor(props: any) {
        super(props, {initProcessing: true, initError: false});
    }

    public static init() {
        Utils.render(<CustomerWebApp/>, 'spa-content');
        Utils.showSpaContent();
    }

    public static logState() {
        // tslint:disable-next-line:no-console
        console.log(Sf.store.getState());
    }

    public componentDidMount = () => {
        Sf.metadata.initAppContext('web', 'customer-web', true)
            .then(appContext => this.updateState({initProcessing: false, initError: undefined}))
            .catch(error => this.updateState({ initProcessing: false, initError: error}));
    }

    public render() {
        const state = this.state;

        if (state.initProcessing) {
            return <NonIdealStateLoading/>;
        }

        if (state.initError) {
            return <NonIdealStateError title='Error while initializing the application!'/>;
        }
        const appContext = (StoreUtils.getAppContext(Sf.store.getState()) as AppContext);
        console.log(appContext.getAppMenus());
        return (
            <Provider store={rootStore}>
                <BrowserRouter>
                    <App name='customer-web'>
                        <RoutingAgent/>
                        <CustomerWebAppBar appContext={appContext} profile={appContext.getUser()}/>
                        <CustomerWebAppRoutes/>
                        
                    </App>
                </BrowserRouter>
            </Provider>
        );
    }
}
