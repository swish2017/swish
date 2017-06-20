import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import {Button} from '@swish/ui-components';
import {FormMessages} from '@swish/ui-components';
import {LinkButton} from '@swish/ui-components';
import {ButtonBar} from '@swish/ui-components';
import {Field} from '@swish/ui-components';
import {Form} from '@swish/ui-components';
import {FormInputField} from '@swish/ui-components';
import {FormErrors} from '@swish/ui-components';
import {Record} from '@swish/ui-components';
import {Card} from '@swish/ui-components';
import {Sf} from '@swish/ui-common';
import {MetadataConstants} from '@swish/ui-common';
import {Grid} from '@swish/ui-components';
import {GridRow} from '@swish/ui-components';
import {GridColumn} from '@swish/ui-components';

export type ResetPasswordModel = {
    token: string;
    password: string;
    confirmPassword?: string;
};

export interface ResetPasswordPageProps {
    token?: string;
}

export interface ResetPasswordPageState {
    processing: boolean;
    resetPasswordModel: ResetPasswordModel;
    formErrorMessage?: FormErrors;
    loginMessages?: Record[];
    successMessage?: Record;
}

//tslint:disable: jsx-no-lambda
export class ResetPasswordPage extends BaseComponent<ResetPasswordPageProps, ResetPasswordPageState> {

    constructor(props: ResetPasswordPageProps) {
        super(props, {processing: false, resetPasswordModel: {token: props.token as string, password: ''}});
    }

    public componentDidMount = () => {
        Sf.metadata
            .getLoginMessages()
            .then((response) => {
                const loginMessages = response;
                this.updateState({initProcessing: false, loginMessages: loginMessages, formErrorMessage: undefined});
            }).catch((error) => {
                this.updateState({initProcessing: false, formErrorMessage: {'': [{error_code: '', message: error.message}]}});
            });
    }

    public render() {
        return (
            <Grid gutter>
                <GridRow halign='center' valign='middle' className='grid-showcase-valign'>
                    <GridColumn xs={12} sm={12} md={6} lg={4}>
                        {this.renderForm()}
                    </GridColumn>
                </GridRow>
                <GridRow halign='center' valign='middle' className='grid-showcase-valign'>
                    <GridColumn xs={12} sm={12} md={6} lg={4}>
                        <LinkButton label='Return to Login' value='/customerlogin' fill minimal/>
                    </GridColumn>
                </GridRow>
            </Grid>
        );
    }

    private renderForm () {
        const state = this.state;
        const resetPasswordInstructions = state.loginMessages && state.loginMessages.find(message => message.type === MetadataConstants.message_login_reset_password_instructions);
        return (
            <Card shadowLevel={2} title='Reset your password'>
                <p>{resetPasswordInstructions && resetPasswordInstructions.message}</p>
                <p className='text-success'>{state.successMessage && state.successMessage.message}</p>
                <Form
                    value={state.resetPasswordModel}
                    errors={state.formErrorMessage}
                    onChange={(model: ResetPasswordModel) => this.updateState({resetPasswordModel: model})}
                    onSubmitValid={(newValue: ResetPasswordModel, updates: ResetPasswordModel) => this.onFormSubmit(newValue, updates)}
                >
                    <Field>
                        <FormMessages/>
                    </Field>
                    <Field>
                        <FormInputField type='text' label='' name='token' placeholder='Enter token' required fill/>
                    </Field>
                    <Field>
                        <FormInputField type='password' label='' name='password' placeholder='Enter password' required fill />
                    </Field>
                    <Field>
                        <FormInputField type='password' label='' name='confirmPassword' placeholder='Confirm password' required fill formValidateCallback={this.validateConfirmPassword}/>
                    </Field>
                    <Field>
                        <Button fill loading={state.processing} label='Reset your password' intent='primary' submit/>
                    </Field>
                </Form>
            </Card>
        );
    }

    private validateConfirmPassword () {
        return {message: 'Password not matched'};
    }

    private onFormSubmit(newValue: ResetPasswordModel, updates: ResetPasswordModel) {
        this.updateState({processing: true});
        const state = this.state;
        const resetPasswordSuccess = state.loginMessages && state.loginMessages.find(message => message.type === MetadataConstants.message_login_reset_password_success_message);
        const resetPasswordData = {
            token: updates.token,
            password: updates.password,
        };
        Sf.authn.resetPassword(resetPasswordData).then(response => {
            this.updateState({processing: false, formErrorMessage: undefined, successMessage: resetPasswordSuccess && resetPasswordSuccess.message});
        }).catch(error => {
            this.updateState({processing: false, formErrorMessage: {'': [{error_code: '', message: error.message}]}});
        });
    }

}
