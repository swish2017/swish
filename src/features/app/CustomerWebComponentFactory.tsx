import { DefaultComponentFactory } from '@swish/ui-components';
import { CreateComponentRequest } from '@swish/ui-components';
import { PageLayoutComponentTypes } from '@swish/ui-components';
import { RenderModes } from '@swish/ui-components';
import { LoginForm } from '@swish/ui-components';
import { CustomerSignupForm } from '@swish/ui-components';
import * as React from 'react';

export class CustomerWebComponentFactory extends DefaultComponentFactory {

    public static INSTANCE: CustomerWebComponentFactory = new CustomerWebComponentFactory();

    public createComponent(request: CreateComponentRequest): JSX.Element | undefined {
        let component;
        if (request.mode === RenderModes.add || request.mode === RenderModes.edit) {
            component = this.createEditComponent(request);
        }

        if (!component) {
            component = super.createComponent(request);
        }

        return component;
    }

    private createEditComponent(request: CreateComponentRequest) {
        const {component} = request;
        const {type, properties: props} = component;

        switch (type) {
            case PageLayoutComponentTypes.signup_form:
                return <CustomerSignupForm {...props}  siteKey='6LfzvCEUAAAAABoKIZM-v49s_uQ7NRqzyOaHxTcD'/>;
            case PageLayoutComponentTypes.login_form:
                return <LoginForm {...props} showSignup helpUrl='/customerlogin/help' />;
            default:
                return undefined;
        }

    }
}
