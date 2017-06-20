import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
import { Record } from '@swish/ui-components';
import { Modal } from '@swish/ui-components';
import { ModalContent } from '@swish/ui-components';
import { ModalActions } from '@swish/ui-components';
import { Button } from '@swish/ui-components';
import { Form } from '@swish/ui-components';
import { Grid } from '@swish/ui-components';
import { GridRow } from '@swish/ui-components';
import { GridColumn } from '@swish/ui-components';
import { FormInputField } from '@swish/ui-components';
import { FormMessages } from '@swish/ui-components';
import { FormErrors } from '@swish/ui-components';
import { Toaster } from '@swish/ui-components';

export interface ResetPasswordFormProps {
    updateReferenceContact?: any;
    modalOpen: boolean;
}
export interface ResetPasswordFormState {
    formProcessing?: boolean;
    user?: object;
    formErrorMessage?: FormErrors;
    modalOpen: boolean;
}
export class ResetPasswordForm extends BaseComponent<ResetPasswordFormProps, ResetPasswordFormState> {
    constructor(props: ResetPasswordFormProps) {
        super(props, {
            modalOpen: props.modalOpen,
        });
    }
    public componentWillReceiveProps(newProps: ResetPasswordFormProps) {
        this.updateState({ modalOpen: newProps.modalOpen });
    }
    public render() {
        const state = this.state;
        const props = this.props;
        return (
            <Modal size='medium' title='Change Password' closeOnEscape={false}  closeOnClickOutside={false} open={state.modalOpen} onClose={() => this.updateState({modalOpen: false, formErrorMessage: {'': [{error_code: '', message: ''}]}})}>
                <ModalContent>
                    <Form
                        ref={(resetPasswordForm) => this.resetPasswordForm = resetPasswordForm || this.resetPasswordForm}
                        value={state.user}
                        errors={state.formErrorMessage}
                        onSubmitValid={(newModel: Record, updates: Record) => { this.onSubmitValid(newModel, updates); }}
                    >
                        <Grid gutter columns={3}>
                            <GridRow>
                                <FormMessages renderAsBox/>
                            </GridRow>
                            <GridColumn columns={12}>
                                <FormInputField type='password' label='Old Password' required name='oldPassword'/>
                            </GridColumn>
                            <GridColumn columns={12}>
                                <FormInputField type='password' label='New Password' required name='newPassword'/>
                            </GridColumn>
                            <GridColumn columns={12}>
                                <FormInputField type='password' label='Confirm Password' required name='confirmPassword'/>
                            </GridColumn>
                        </Grid>
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button label='Cancel' onClick={() => this.updateState({modalOpen: false})}/>
                    <Button intent='primary' label='Submit' loading={state.formProcessing} onClick={() => this.resetPasswordForm.submit()}/>
                </ModalActions>
            </Modal>
        );
    }
    private onSubmitValid = (model: any, updates: any) => {
        this.updateState({ formProcessing: true });
        delete model.confirmPassword;
        Sf.metadata.changePassword(model)
        .then((serverResp: Record) => {
            Toaster.success('Password Changed!');
            this.updateState({formProcessing: false, modalOpen: false, formErrorMessage: {'': [{error_code: '', message: ''}]}});
        }).catch(error => {
            this.updateState({formErrorMessage: {'': [{error_code: '', message: error.message}]}, formProcessing: false});
        });
    }
}
