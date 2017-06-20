import * as React from 'react';
import { ObjectDataview } from '@swish/ui-common';
import { BaseComponent, Record, RecordInfoWeb, } from '@swish/ui-components';
import * as classNames from 'classnames';
import './ObjectHomePageStyles.scss';
import { Sf } from '@swish/ui-common';
import { MetadataConstants } from '@swish/ui-common';
import { CustomerWebPage } from '../../components/pages/CustomerWebPage';
export interface ObjectHomePageProps {
    objectIdOrKey: string;
}
export interface ObjectHomePagePageState {
    recordInfo: Record;
}
export class ObjectHomePage extends BaseComponent<ObjectHomePageProps, ObjectHomePagePageState> {
    constructor(props: any) {
        super(props);
        this.state = { recordInfo: new Record() };
    }
    public componentDidMount(){
        this.getRecordFromApi(this.props.objectIdOrKey);
    }
    public componentWillReceiveProps(nextProps: ObjectHomePageProps) {
        this.getRecordFromApi(nextProps.objectIdOrKey);
    }
    public render() {
        const state = this.state;
        const props = this.props;
        return (
            <CustomerWebPage>
                <RecordInfoWeb
                    object={MetadataConstants.object_tobject}
                    record={state.recordInfo}
                />
                <ObjectDataview object={props.objectIdOrKey} dataGridHeight='calc(100vh - 250px)' paginationEnabled/>
            </CustomerWebPage>
        );
    }
    private async getRecordFromApi(objectName: string) {
        const metadata = await Sf.metadata.initMetadata(objectName);
        const datavalues = metadata.getObject(objectName);
        this.updateState({
            recordInfo: datavalues,
        });
    }
}
