import * as React from 'react';
import { BaseComponent } from '@swish/ui-components';
import { RecordViewer } from '@swish/ui-common';

export interface RecordViewPageProps {
    recordId: string;
    object: string;
}

export class RecordViewPage extends BaseComponent<RecordViewPageProps, void> {

    public render() {
        const props = this.props;

        return (
            <RecordViewer
                object={props.object}
                recordId={props.recordId}
            />
        );
    }
}
