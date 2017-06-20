import * as React from 'react';
import { BaseComponent } from '@swish/ui-components';
import { RecordEditor } from '@swish/ui-common';

export interface ObjectEditPageProps {
    recordId?: string;
    object: string;
}

export class RecordEditPage extends BaseComponent<ObjectEditPageProps, void> {

    public render() {
        const props = this.props;

        return (
            <RecordEditor
                object={props.object}
                recordId={props.recordId}
            />
        );
    }
}
