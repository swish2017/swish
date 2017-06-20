import * as React from 'react';
import './ReferralPageStyles.scss';
import {BaseComponent} from '@swish/ui-components';
import { CustomerWebPage } from '../../components/pages/CustomerWebPage';
import { Metadata } from '@swish/ui-components';
import { NonIdealStateLoading } from '@swish/ui-components';
import { NonIdealStateInitError } from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
import { Pagelayout } from '@swish/ui-components';
import { StoreUtils } from '@swish/ui-common';
import { UIState } from '@swish/ui-common';
import { MetadataConstants } from '@swish/ui-common';
import { WebComponentFactory } from '@swish/ui-common';
import { RenderModes } from '@swish/ui-components';
import { DataGridRow } from '@swish/ui-components';
import { FieldType } from '@swish/ui-components';
import { Record } from '@swish/ui-components';
import { connect } from 'react-redux';
import { ReferralForm } from '@swish/ui-components';
import { Utils } from '@swish/ui-components';
import { Toaster } from '@swish/ui-components';
import { Image } from '@swish/ui-components';
import { Grid } from '@swish/ui-components';
import { GridColumn } from '@swish/ui-components';
import { FormErrors } from '@swish/ui-components';
import { SidePanel } from './SidePanel';
import { ReferralTable } from './ReferralTable';
import { ContactForm } from './modal/ContactForm';

const referralFormLayout = Object.assign(new Metadata(), require('./referralFormLayout.json'));
const opportunityFields = ['id', 'name', 'primary_contact_id', 'status', 'stage', 'owner_id']
const columns = [
            {name: 'opportunity_name', label: 'Opportunity Name', type: FieldType.text},
            {name: 'name', label: 'Name', type: FieldType.text},
            {name: 'owner', label: 'Owner', type: FieldType.text},
            {name: 'status', label: 'Status', type: FieldType.text},
            {name: 'stage', label: 'Stage', type: FieldType.text}
        ];
export interface ReferralPageProps {
    object: string;
    recordId?: string;
    renderMode?: RenderModes;
    state?: UIState;
    preDefaults?: Record;
}
export interface ReferralPageState {
    initProcessing: boolean;
    pageLayoutId?: string;
    layout?: Pagelayout;
    state: UIState;
    metadata: Metadata;
    tableValue?: DataGridRow[];
    rows?: DataGridRow;
    referenceContact: Record;
    value: Record;
    formProcessing?: boolean;
    settings?: Record;
    user?: object;
    formErrorMessage?: FormErrors;
}
const referee = sessionStorage.getItem('referee');
@connect((state: any) => { return { state }; })
export class ReferralPage extends BaseComponent<ReferralPageProps, ReferralPageState> {
    constructor(props: ReferralPageProps) {
        super(props, {
            initProcessing: true
        });
        if (!referee) {
            Sf.nav.redirect('/customer/login');
        }
    }
    public componentDidMount = () => {
        this.initComponent(this.props);
    }
    public render() {
        const props = this.props;
        const state = this.state;
        const factory = new WebComponentFactory();
        if (state.initProcessing) {
            return <NonIdealStateLoading />;
        }
        const record = props.recordId ? StoreUtils.getRecord(props.state, props.object, props.recordId) : StoreUtils.getNewRecord(props.state, props.object);
        //const pageLayout = StoreUtils.getRecord(props.state, MetadataConstants.object_pagelayout, state.pageLayoutId as string) as Pagelayout;
        const pageLayout = referralFormLayout;
        const metadata = StoreUtils.getMetadata(props.state, [props.object]) as Metadata;
        if (!record || !metadata) {
            return <NonIdealStateInitError message='Could not read Record or its metadata to view the page' />;
        }
        const left_panel_image = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'left_panel_image') : undefined ;
        const left_panel_description = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'left_panel_description') : undefined ;
        const right_panel_image = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'right_panel_image') : undefined ;
        const right_panel_description = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'right_panel_description') : undefined ;
        const pre_referral_heading = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'pre_referral_heading') : undefined ;
        const pre_referral_description = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'pre_referral_description') : undefined ;
        const banner_image = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'banner_image') : undefined ;
        const referral_form_heading = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'referral_form_heading') : undefined ;
        const referral_form_description = (state.settings) ? state.settings.records.find((x: any) => x.key.toLowerCase() === 'referral_form_description') : undefined ;
        if (!state.referenceContact) {
            return (
                <ContactForm updateReferenceContact={(referenceContact: any) => {this.updateState({'referenceContact': referenceContact})}}/>
            );
        }
        return (
            <CustomerWebPage>
                <div className='sui-banner'>
                <Image src={banner_image && banner_image.value} />
                </div>
                <div className='sui-content'>
                    <h1 className='sui-center'>{referral_form_heading && referral_form_heading.value}</h1>
                    <h3 className='sui-center'>{referral_form_description && referral_form_description.value}</h3>
                    <hr className='sui-hr'/>
                    <Grid gutter columns={12} className='sui-referral-container'>
                        <GridColumn columns={3}>
                            <SidePanel 
                                panelImage={left_panel_image && left_panel_image.value}
                                panelText={left_panel_description && left_panel_description.value}
                            />
                        </GridColumn>
                        <GridColumn columns={6}>
                            <ReferralForm
                                factory={factory}
                                object={props.object}
                                layout={pageLayout}
                                metadata={metadata}
                                renderMode={props.renderMode as RenderModes}
                                handleOnSubmitValid={(newModel: Record, updates: Record) => { this.handleOnSubmitValid(newModel, updates); }}
                                value={state.value}
                                formProcessing={state.formProcessing}
                                maxWidth='100%'
                            />
                        </GridColumn>
                        <GridColumn columns={3}>
                            <SidePanel 
                                panelImage={right_panel_image && right_panel_image.value}
                                panelText={right_panel_description && right_panel_description.value}
                            />
                        </GridColumn>
                    </Grid>
                     {
                         state.tableValue &&
                         state.tableValue.length > 0 &&
                         <ReferralTable
                            columns={columns}
                            rows={state.tableValue}
                            title={pre_referral_heading && pre_referral_heading.value}
                            description={pre_referral_description && pre_referral_description.value}
                         />
                    }
                </div>
            </CustomerWebPage>
        );
    }
    private initComponent = async (props: ReferralPageProps) => {
        try {
            const settingfields = ['id', 'name', 'description', 'active', 'value', 'category', 'key'];
            const responses = await Promise.all([
                props.recordId ? Sf.data.initRecord(props.object, props.recordId) : Sf.data.initNewRecord(props.object),
                Sf.metadata.initMetadata(props.object),
                Sf.data.list('contact', undefined, undefined, `email=${referee}`),
                Sf.data.list('settings', undefined, settingfields, 'category=referral_management'),
            ]);
            const record: Record = responses[0];
            const pageLayoutId = record._metadata && record._metadata.pagelayout_id ? record._metadata.pagelayout_id : MetadataConstants.default_pagelayout_id;

            //Init the pagelayout for given id.
            await Sf.metadata.initPageLayout(pageLayoutId);
            const metadata = responses[1];
            const referenceContact = responses[2].records[0];
            const settings = responses[3];
            let tableValue: Record[] = [];
            if (referenceContact) {
                sessionStorage.setItem('referenceContactId', referenceContact.id);
                const rows = await Sf.data.list('opportunity', undefined, opportunityFields, `reference_contact_id=${referenceContact.id}`)
                tableValue = rows.records
                .map((row) => {
                    const opportunity_name = row.name || '';
                    const name = row.primary_contact_id__r && row.primary_contact_id__r.name || '';
                    const owner = row.owner_id__r && row.owner_id__r.name || '';
                    const status = row.status__r && row.status__r.name || '';
                    const stage = row.stage__r && row.stage__r.name || '';
                    return {opportunity_name: opportunity_name, name: name, owner: owner, status: status, stage: stage};
                });
            }
            //If both promises complete successfully, then we have all the data we need in
            //the store which we can read inside render method.
            this.updateState({
                initProcessing: false,
                initError: undefined,
                pageLayoutId: pageLayoutId,
                model: record,
                metadata: metadata,
                referenceContact: referenceContact,
                tableValue: tableValue,
                settings: settings,
                user: {email: referee},
            });

        } catch (error) {
            this.updateState({
                initProcessing: false,
                initError: error,
            });
        }
}
private refreshReferral = async (referenceContactId: string) => {
        const props = this.props;
        const responses = await Promise.all([
            Sf.data.initNewRecord(props.object),
            await Sf.data.list(MetadataConstants.object_opportunity, undefined, opportunityFields, `reference_contact_id=${referenceContactId}`)
        ]);
        const record: Record = new Record();
        //const record = responses[0]
        const rows = responses[1];
        const tableValue = rows.records
            .map((row) => {
                const opportunity_name = row.name || '';
                const name = row.primary_contact_id__r && row.primary_contact_id__r.name || '';
                const owner = row.owner_id__r && row.owner_id__r.name || '';
                const status = row.status__r && row.status__r.name || '';
                const stage = row.stage__r && row.stage__r.name || '';
                return {opportunity_name: opportunity_name, name: name, owner: owner, status: status, stage: stage};
            });
        this.updateState({
                tableValue: tableValue,
                value: record,
            });
    }
    private handleOnSubmitValid = (model: any, updates: any) => {
        this.updateState({ formProcessing: true });
        const props = this.props;
        const state = this.state;
        const modelToUpdate: Record = model;
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
        modelToUpdate.reference_contact_id = state.referenceContact.id; //set reference contact
        modelToUpdate.reference_contact_id__r = {
            name : state.referenceContact.name,
            id : state.referenceContact.id,
            key : state.referenceContact.key,
        };
        Sf.data.saveRecord(props.object, modelToUpdate)
        .then((serverResp: Record) => {
         const record: Record = new Record();
         this.updateState({ formProcessing: false, value: record });
         Toaster.success('Referral Created!');
         this.refreshReferral(state.referenceContact.id);
        }).catch(error => {
            this.updateState({saveError: {'': [{error_code: '', message: error.message}]}, formProcessing: false});
        });
    }
}
