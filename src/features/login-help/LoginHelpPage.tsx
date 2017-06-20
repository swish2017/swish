import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import {App} from '@swish/ui-components';
import {Grid} from '@swish/ui-components';
import {GridRow} from '@swish/ui-components';
import {GridColumn} from '@swish/ui-components';
import {Record} from '@swish/ui-components';
import {LinkButton} from '@swish/ui-components';
import {Card} from '@swish/ui-components';
import {ForgotUsernamePage} from './ForgotUsernamePage';
import {ForgotPasswordPage} from './ForgotPasswordPage';
import {Sf} from '@swish/ui-common';
import { NonIdealStateLoading } from '@swish/ui-components';

export interface LoginHelpPageState {
    initProcessing: boolean;
    loginMessages?: Record[];
    successMessage?: Record;
}

//tslint:disable: jsx-no-lambda
export class LoginHelpPage extends BaseComponent<{}, LoginHelpPageState> {

    constructor(props) {
        super(props, {initProcessing: true, loginMessages: []});
    }

    public componentDidMount = () => {
        Sf.metadata
            .getLoginMessages()
            .then((response: any) => {
                const loginMessages = response;
                this.updateState({initProcessing: false, loginMessages: loginMessages, formErrorMessage: undefined});
            }).catch((error: any) => {
                this.setStateDoneLoading();
                this.updateState({initProcessing: false, formErrorMessage: {'': [{error_code: '', message: error.message}]}});
            });
    }

    public render() {
        const state = this.state;
        if (state.initProcessing) {
            return <NonIdealStateLoading/>;
        }
        return (
            <App name='app-web-login-help'>
                {
                    state.successMessage
                    &&
                    (
                        <Grid gutter>
                            <GridRow halign='center' valign='middle' className='grid-showcase-valign'>
                                <GridColumn xs={12} sm={12} md={6} lg={4}>
                                    <Card shadowLevel={2} title={state.successMessage.title}>
                                        <p>{state.successMessage.message}</p>
                                        <LinkButton label='Continue' intent='success' value='/customerlogin' fill/>
                                    </Card>
                                </GridColumn>
                            </GridRow>
                        </Grid>
                    )
                }
                {
                    !state.successMessage
                    &&
                    (
                        <Grid gutter>
                            <GridRow halign='center' valign='middle' className='grid-showcase-valign'>
                                <GridColumn xs={12} sm={12} md={6} lg={4}>
                                    <ForgotPasswordPage loginMessages={state.loginMessages} onSave={(successMessage) => this.handleOnSave(successMessage)}/>
                                </GridColumn>
                                <GridColumn xs={12} sm={12} md={6} lg={4}>
                                    <ForgotUsernamePage loginMessages={state.loginMessages} onSave={(successMessage) => this.handleOnSave(successMessage)}/>
                                </GridColumn>
                            </GridRow>
                            <GridRow halign='center' valign='middle' className='grid-showcase-valign'>
                                <GridColumn xs={12} sm={12} md={6} lg={4}>
                                    <LinkButton label='Return to Login' value='/customerlogin' fill/>
                                </GridColumn>
                            </GridRow>
                        </Grid>
                    )
                }
            </App>
        );
    }

    private handleOnSave(successMessage) {
        this.updateState({successMessage});
    }

}
