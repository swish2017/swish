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

export interface ForgotUsernamePageProps {
    loginMessages?: Record[];
    onSave: (data: Object) => void;
}

export interface ForgotUsernamePageState {
    processing: boolean;
    email?: string;
    formErrorMessage?: FormErrors;
}

//tslint:disable: jsx-no-lambda
export class ForgotUsernamePage extends BaseComponent<ForgotUsernamePageProps, ForgotUsernamePageState> {

    constructor(props) {
        super(props, {processing: false});
    }

    public render() {
        const state = this.state;
        const props = this.props;

        const loginMessages = props.loginMessages;
        const forgotUsernameInstructions = loginMessages && loginMessages.find(message => message.type === MetadataConstants.message_login_forgot_username_instructions);
        return (
            <Card shadowLevel={2} title='Forgot your username?'>
                <p>{forgotUsernameInstructions && forgotUsernameInstructions.message}</p>
                <Form
                    value={{email: state.email}}
                    errors={state.formErrorMessage}
                    onChange={(model: Record) => this.updateState({email: model.email})}
                    onSubmitValid={(newValue: Record, updates: Record) => this.onFormSubmit(newValue, updates)}
                >
                    <FormMessages/>
                    <Field>
                        <FormInputField type='email' label='' name='email' placeholder='Enter email' required fill/>
                    </Field>
                    <Field>
                        <Button loading={state.processing} label='Retrieve your username' intent='primary' fill submit/>
                    </Field>
                </Form>
            </Card>
        );
    }

    private onFormSubmit(newValue: Record, updates: Record) {
        this.updateState({processing: true});
        const props = this.props;
        const loginMessages = props.loginMessages;
        const forgotUsernameSuccess = loginMessages && loginMessages.find(message => message.type === MetadataConstants.message_login_forgot_password_success_message);

        Sf.authn.forgotUsername(updates.email).then(response => {
            this.props.onSave({title: 'Forgot username', message: forgotUsernameSuccess && forgotUsernameSuccess.message});
        }).catch(error => {
            this.props.onSave({title: 'Forgot username', message: error.message});
        });
    }

}
