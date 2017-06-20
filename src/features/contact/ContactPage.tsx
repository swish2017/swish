import './ContactPageStyles.scss';
import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import { CustomerWebPage } from '../../components/pages/CustomerWebPage';
import {FormErrors} from '@swish/ui-components';
import { DataGridRow } from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
import { Utils } from '@swish/ui-components';
import { MetadataConstants } from '@swish/ui-common';
import { Record } from '@swish/ui-components';
import { NonIdealStateLoading } from '@swish/ui-components';
import { NonIdealStateInitError } from '@swish/ui-components';
import { connect } from 'react-redux';
import { WebComponentFactory } from '@swish/ui-common';
import { RenderModes } from '@swish/ui-components';
import { PageLayoutRenderer2 } from '@swish/ui-components';
import { StoreUtils } from '@swish/ui-common';
import { UIState } from '@swish/ui-common';
import { ButtonBar } from '@swish/ui-components';
import { Button } from '@swish/ui-components';
import { Toaster } from '@swish/ui-components';

export interface ContactPageProps  {
    object: string;
    recordId: string;
    renderMode: RenderModes;
    state?: UIState;
    returnUrl?: string;
    preDefaults?: Record;
}
export interface ContactPageState {
    initProcessing: boolean;
    userName?: string;
    formErrorMessage?: FormErrors;
    tableValue?: DataGridRow[];
    activePage: number;
    rows?: DataGridRow;
    pageLayoutId: string;
}
@connect((state: any) => { return { state }; })
export class ContactPage extends BaseComponent<ContactPageProps, ContactPageState> {
    public static defaultProps = {
            object: MetadataConstants.object_opportunity,
            referenceContactId: 'scont2cgsavvwn7md425udjp',
    };
    constructor(props: ContactPageProps) {
        super(props, {
            initProcessing: true,
            activePage: 1,
        });
        const referee = sessionStorage.getItem('referee');
        if (!referee) {
            Sf.nav.redirect('/customer/login');
        }
    }
    public componentDidMount = () => {
        this.initApiRequest(this.props);
    }
    public render() {
        const props = this.props;
        const state = this.state;
        if (state.initProcessing) {
            return <NonIdealStateLoading />;
        }
        const record = props.recordId ? StoreUtils.getRecord(props.state, props.object, props.recordId) : StoreUtils.getNewRecord(props.state, props.object);
        const pageLayout = StoreUtils.getRecord(props.state, MetadataConstants.object_pagelayout, state.pageLayoutId as string) as Pagelayout;
        //const pageLayout = referralFormLayout;
        const metadata = StoreUtils.getMetadata(props.state, [props.object]) as Metadata;
        if (!record || !metadata) {
            return <NonIdealStateInitError message='Could not read Record or its metadata to view the page' />;
        }
        const actions = [];
        actions.push(<Button label={props.renderMode === 'view' ? 'Back' : 'Cancel' } onClick={() => Sf.nav.goBack()} />);
        if (props.renderMode !== 'view' && !Utils.isBlank(props.recordId) && metadata.hasObjectCreate(props.object) || Utils.isBlank(props.recordId) && metadata.hasObjectUpdate(props.object)) {
            actions.push(<Button submit label='Save' />);
        }else {
            actions.push(<Button label='Edit' onClick={() => Sf.nav.navTo(`/customer/contact/${props.recordId}/edit`)}/>);
        }
        const factory = new WebComponentFactory();
        return (
            <CustomerWebPage >
                <PageLayoutRenderer2
                    componentFactory={factory}
                    onSubmitValid={this.handleOnSubmitValid}
                    value={record}
                    layout={pageLayout}
                    object={props.object}
                    mode={props.renderMode as RenderModes}
                    metadata = {metadata}
                    actions={<ButtonBar loading={state.formProcessing}>{actions}</ButtonBar>}
                />
            </CustomerWebPage>
        );
    }
    private initApiRequest = async (props: ContactPageProps) => {
        try {
            const responses = await Promise.all([
                props.recordId ? Sf.data.initRecord(props.object, props.recordId) : Sf.data.initNewRecord(props.object),
                Sf.metadata.initMetadata(props.object),
            ]);
            const record: Record = responses[0];
            const pageLayoutId = record._metadata && record._metadata.pagelayout_id ? record._metadata.pagelayout_id : MetadataConstants.default_pagelayout_id;

            //Init the pagelayout for given id.
            await Sf.metadata.initPageLayout(pageLayoutId);
            const metadata = responses[1];
            this.updateState({
                initProcessing: false,
                initError: undefined,
                pageLayoutId: pageLayoutId,
                model: record,
                metadata: metadata,
            });
        } catch (error){
            this.updateState({
                initProcessing: false,
                initError: true,
            });
        }
    }
    private handleOnSubmitValid = async (model: Record, updates: Record) => {
        const props = this.props;
        const modelToUpdate: Record = new Record();
        if (props.preDefaults) {
            //assign if the fields from predefault exist in the model
            Object.keys(props.preDefaults).forEach(fieldKey => {
                if (fieldKey in model) {
                    Object.assign(updates, {[fieldKey]: Utils.get(props.preDefaults, fieldKey)});
                }
            });
        }
        modelToUpdate.id = model.id;
        Object.keys(updates).forEach((fieldkey: string) => {
                if ( fieldkey !== 'parent__id__r') {
                    if (Utils.isBlank(updates[fieldkey])) {
                    modelToUpdate[fieldkey] = null;
                    } else {
                    modelToUpdate[fieldkey] = updates[fieldkey];
                    }
                }
            });
        this.updateState({ formProcessing: true });
        await Sf.data.saveRecord(props.object, modelToUpdate)
        .then((serverResp: Record) => {
         Sf.nav.goBack();
        }).catch(error => {
            this.updateState({saveError: {'': [{error_code: '', message: error.message}]}, formProcessing: false});
        });
    }
}
