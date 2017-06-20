import * as React from 'react';
import { ErrorItem } from '@swish/ui-components';
import { FormErrors } from '@swish/ui-components';
import { Record } from '@swish/ui-components';
import { PageLayout } from '@swish/ui-components';
import { Metadata } from '@swish/ui-components';
import { PageLayoutRenderer2 } from '@swish/ui-components';
import { Link } from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
import { Utils, App } from '@swish/ui-components';
import { NonIdealStateLoading } from '@swish/ui-components';
import {BasePageWeb} from '../app/BasePageWeb';
import {MetadataConstants} from '@swish/ui-common';
import { Toaster } from '@swish/ui-components';
import './SignupPageStyles.scss';
import { CustomerWebComponentFactory } from '../app/CustomerWebComponentFactory';

export interface SignupPageState {
    layout ?: PageLayout;
    initProcessing ?: boolean;
    errors ?: FormErrors;
    model ?: Object;
    responsibilityId: string;
}

export class SignupPage extends BasePageWeb<{}, SignupPageState> {
    constructor(props: any) {
        super(props, {initProcessing: true, model: {}});
    }

    public static init() {
        Utils.render(<SignupPage/>, 'spa-content');
    }

    public componentDidMount = () => {
        Sf.metadata
            .getSignupPagelayout()
            .then((layout: any) => {
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
            <App name='swish-customer-signup-web'>
                <div className='swish-signup-form'>
                    <PageLayoutRenderer2
                        componentFactory={factory}
                        errors={state.errors}
                        object='na'
                        mode='edit'
                        metadata={new Metadata()}
                        layout={state.layout as Pagelayout}
                        value={state.model}
                        onSubmitValid={this.handleSubmit}
                    />
                </div>
                <div className='filler'>&nbsp;</div>
                <div className='sui-text-center'>Already have an account? <Link redirect to='/customerlogin'>Login</Link></div>
            </App>
        );
    }

    private handleSubmit = async (model: Record) => {
        try {
            delete model.confirmpassword;
            delete model.captcha;
            model.primary_responsibility_id = MetadataConstants.customer_portal_layout_id;
            model.key = model.email;
            model.primary_responsibility_id__r = {
                id: MetadataConstants.customer_portal_layout_id,
            };
            const modelToUpdate: Record = Object.assign({}, new Record(), model);
            Sf.signup.createUser(MetadataConstants.object_user, modelToUpdate)
            .then((serverResp: Record) => {
                Toaster.success('Registered Successfully!');
                Sf.nav.redirect('/customerlogin');
            }).catch(error => {
                this.updateState({errors: {signup: [{error_code: '', message: error.message}]}});
            });
        } catch (error) {
            this.setNewState({errors: {signup: [new ErrorItem('', error.message)]}});
        }
    }

}
