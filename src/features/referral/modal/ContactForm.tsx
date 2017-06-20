import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
import { MetadataConstants } from '@swish/ui-common';
import { Record } from '@swish/ui-components';
import { Modal } from '@swish/ui-components';
import { ModalContent } from '@swish/ui-components';
import { ModalActions } from '@swish/ui-components';
import { Button } from '@swish/ui-components';
import { Form } from '@swish/ui-components';
import { Grid } from '@swish/ui-components';
import { GridColumn } from '@swish/ui-components';
import { FormInputField } from '@swish/ui-components';
import { FormMessages } from '@swish/ui-components';
import { FormErrors } from '@swish/ui-components';

export interface ContactFormProps {
    updateReferenceContact?: any;
}
export interface ContactFormState {
    formProcessing?: boolean;
    user?: object;
    formErrorMessage?: FormErrors;
    modalOpen: boolean;
}
const referee = sessionStorage.getItem('referee');
export class ContactForm extends BaseComponent<ContactFormProps, ContactFormState> {
    constructor(props: ContactFormProps) {
        super(props, {
            modalOpen: true,
            user: {email: referee},
        });
    }
    public render() {
        const state = this.state;
        return (
            <Modal size='medium' title='User Details' open={state.modalOpen} onClose={() => Sf.nav.navTo('/customer/login')}>
                <ModalContent>
                    <Form
                        ref={(contactForm) => this.contactForm = contactForm || this.contactForm}
                        value={state.user}
                        errors={state.formErrorMessage}
                        onSubmitValid={(newModel: Record, updates: Record) => { this.onSubmitValid(newModel, updates); }}
                    >
                        <Grid gutter columns={3}>
                            <GridColumn columns={12}>
                                <FormInputField type='text' label='First Name' required name='first_name'/>
                                <FormMessages name='user'/>
                            </GridColumn>
                            <GridColumn columns={12}>
                                <FormInputField type='text' label='Last Name' required name='last_name'/>
                            </GridColumn>
                            <GridColumn columns={12}>
                                <FormInputField type='email' readOnly clearable={false} label='Email' required name='email'/>
                            </GridColumn>
                        </Grid>
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button label='Cancel' onClick={() => Sf.nav.navTo('/customer/login')}/>
                    <Button intent='primary' label='Submit' loading={state.formProcessing} onClick={() => this.contactForm.submit()}/>
                </ModalActions>
            </Modal>
        );
    }
    private onSubmitValid = (model: any, updates: any) => {
        this.updateState({ formProcessing: true });
        const modelToUpdate: Record = Object.assign({}, new Record(), model);
        Sf.data.saveRecord(MetadataConstants.object_contact, modelToUpdate)
        .then((serverResp: Record) => {
            sessionStorage.setItem('referenceContactId', serverResp.id);
            this.props.updateReferenceContact(serverResp);
            this.updateState({formProcessing: false, modalOpen: false});
        }).catch(error => {
            this.updateState({saveError: {'': [{error_code: '', message: error.message}]}, formProcessing: false});
        });
    }
}
