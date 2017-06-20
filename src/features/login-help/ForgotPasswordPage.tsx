import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import {Button} from '@swish/ui-components';
import {FormMessages} from '@swish/ui-components';
import {Field} from '@swish/ui-components';
import {Form} from '@swish/ui-components';
import {FormInputField} from '@swish/ui-components';
import {FormErrors} from '@swish/ui-components';
import {Record} from '@swish/ui-components';
import {Card} from '@swish/ui-components';
import {Sf} from '@swish/ui-common';
import {MetadataConstants} from '@swish/ui-common';

export interface ForgoPasswordPageProps {
    loginMessages?: Record[];
    onSave: (data: Object) => void;
}

export interface ForgotPasswordPageState {
    processing: boolean;
    userName?: string;
    formErrorMessage?: FormErrors;
}

//tslint:disable: jsx-no-lambda
export class ForgotPasswordPage extends BaseComponent<ForgoPasswordPageProps, ForgotPasswordPageState> {

    constructor(props) {
        super(props, {processing: false});
    }

    public render() {
        const state = this.state;
        const props = this.props;

        const loginMessages = props.loginMessages;
        const forgotPasswordInstructions = loginMessages && loginMessages.find(message => message.type === MetadataConstants.message_login_forgot_password_instructions);

        return (
            <Card shadowLevel={2} title='Forgot your password?'>
                <p>{forgotPasswordInstructions && forgotPasswordInstructions.message}</p>
                <Form
                    value={{userName: state.userName}}
                    errors={state.formErrorMessage}
                    onChange={(model: Record) => this.updateState({userName: model.userName})}
                    onSubmitValid={(newValue, updates) => this.onFormSubmit(newValue, updates)}
                >
                    <FormMessages/>
                    <Field>
                        <FormInputField type='text' label='' name='userName' placeholder='Enter Username' required fill/>
                    </Field>
                    <Field>
                        <Button loading={state.processing} label='Reset your password' intent='primary' fill submit/>
                    </Field>
                </Form>
            </Card>
        );
    }

    private onFormSubmit(newValue, updates) {
        this.updateState({processing: true});
        const props = this.props;
        const loginMessages = props.loginMessages;
        const forgotPasswordSuccess = loginMessages && loginMessages.find(message => message.type === MetadataConstants.message_login_forgot_password_success_message);

        Sf.authn.forgotPassword(updates.userName).then(response => {
            this.props.onSave({title: 'Forgot password', message: forgotPasswordSuccess && forgotPasswordSuccess.message});
        }).catch(error => {
            this.props.onSave({title: 'Forgot password', message: error.message});
        });
    }

}
