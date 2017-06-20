import { StoreUtils } from '@swish/ui-common';
import * as React from 'react';
import { Button, ButtonBar, Toaster } from '@swish/ui-components';
import { connect } from 'react-redux';
import { Sf } from '@swish/ui-common';
import { MetadataConstants } from '@swish/ui-common';
import { BaseComponent } from '@swish/ui-components';
import { Pagelayout } from '@swish/ui-components';
import { Record } from '@swish/ui-components';
import { NonIdealStateLoading } from '@swish/ui-components';
import { NonIdealStateInitError } from '@swish/ui-components';
import { NonIdealStateAuthError } from '@swish/ui-components';
import { FormErrors } from '@swish/ui-components';
import { PageLayoutRenderer2 } from '@swish/ui-components';
import { Metadata } from '@swish/ui-components';
import { Utils } from '@swish/ui-components';
import { EntityAction } from '@swish/ui-components';
import { WebComponentFactory } from '@swish/ui-common';
import { UIState } from '@swish/ui-common';
import { Dialogs } from '@swish/ui-components';
import { AppContext } from '@swish/ui-components';
import { ResetPasswordForm } from './modal/ResetPasswordForm';

export interface ProfileViewerProps {
    object: string;
    recordId: string;
    returnUrl?: string;
    state: UIState;
    inline?: boolean;
}

export interface ProfileViewerState {
    initProcessing: boolean;
    initError?: FormErrors;
    pageLayoutId?: string;
    modalOpen?: boolean;
}

class ProfileViewerClass extends BaseComponent<ProfileViewerProps, ProfileViewerState> {
    constructor(props: ProfileViewerProps) {
        super(props, {
            initProcessing: true,
            modalOpen: false,
        });
    }

    public componentDidMount = () => {
        this.initComponent(this.props);
    }

    public componentWillReceiveProps(newProps: ProfileViewerProps) {
        if (this.props.object !== newProps.object || this.props.recordId !== newProps.recordId) {
            this.updateState({ initProcessing: true });
            this.initComponent(newProps);
        }
    }

    public render() {
        const props = this.props;
        const state = this.state;
        if (state.initProcessing) {
            return <NonIdealStateLoading />;
        }

        if (state.initError) {
            //If this is busines error, we will have error_code in the msg.
            return <NonIdealStateInitError message={Utils.toJson(state.initError) || 'Error while initializing'} />;
        }


        //We will need whatever we need from the store as it must have been initialized as part of fullInit.
        const record = StoreUtils.getRecord(props.state, props.object, props.recordId);
        const pageLayout = StoreUtils.getRecord(props.state, MetadataConstants.object_pagelayout, state.pageLayoutId as string) as Pagelayout;
        const metadata = StoreUtils.getMetadata(props.state, [props.object]) as Metadata;

        if (!record || !metadata) {
            return <NonIdealStateInitError message='Could not read Record or its metadata to view the page' />;
        }

        //Check if user has access to view the records of this object. If not, it is an auth error.
        if (!metadata.hasObjectRead(props.object)) {
            return <NonIdealStateAuthError />;
        }
        const actions = [];
        actions.unshift(<Button label='Back' onClick={() => Sf.nav.goBack()} />);
        actions.push(<Button label='Edit' onClick={() => this.editProfile()} />);
        actions.push(<Button label='Change Password' onClick={() => this.updateState({ modalOpen: true })} />);
        const factory = new WebComponentFactory();

        const className = 'swish-' + state.appContext.getDeviceType() + '-recordview';
        return (
            <div>
                <ResetPasswordForm modalOpen={state.modalOpen}/>
                <PageLayoutRenderer2
                    componentFactory={factory}
                    value={record}
                    metadata={metadata}
                    object={props.object}
                    layout={pageLayout as any}
                    inline={props.inline || false}
                    actions={<ButtonBar>{actions}</ButtonBar>}
                    deviceType={state.appContext.getDeviceType()}
                    mode='view'
                    className={className}
                />
            </div>
        );
    }

    private initComponent = async (props: ProfileViewerProps) => {
        //To display the page, we need following information.
        //1. Fresh Record from DB
        //2. Record Object metadata including its picklists, page layout

        //if application is partner_web or customer_web get the appropriate pagelayout by passing type.
        const uiState = props.state;
        const appContext = StoreUtils.getAppContext(uiState) as AppContext;

        const pagelayoutType = MetadataConstants.pagelayout_type_customer;

        try {
            const responses = await Promise.all([
                Sf.data.initRecord(props.object, props.recordId, pagelayoutType),
                Sf.metadata.initMetadata(props.object),
            ]);

            const record: Record = responses[0];
            const pageLayoutId = record._metadata && record._metadata.pagelayout_id ? record._metadata.pagelayout_id : MetadataConstants.default_pagelayout_id;
            //Init the pagelayout for given id.
            await Sf.metadata.initPageLayout(pageLayoutId);

            //If both promises complete successfully, then we have all the data we need in
            //the store which we can read inside render method.
            this.updateState({
                initProcessing: false,
                initError: undefined,
                pageLayoutId: pageLayoutId,
                appContext,
            });

        } catch (error) {
            console.error(error);
            this.updateState({
                initProcessing: false,
                initError: error,
            });
        }
    }
    private editProfile = async () => {
        const props = this.props;
        const urlInfo = Sf.nav.getEditRecordUrlInfo(props.object, props.recordId);
        if (urlInfo) {
            if (urlInfo.redirect) {
                Sf.nav.redirect(urlInfo);
            } else {
                Sf.nav.navTo(urlInfo.url);
            }
        }
    }
}

const ProfileViewer = connect((state: any) => { return { state }; })(ProfileViewerClass);
export { ProfileViewer };
