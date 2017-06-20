import * as React from 'react';
import {BasePageWeb} from '../app/BasePageWeb';
import {ProfileViewer} from '../profileviewer/ProfileViewer';
import {MetadataConstants} from '@swish/ui-common';
import { CustomerWebPage } from '../../components/pages/CustomerWebPage';
import { StoreUtils } from '@swish/ui-common';
import { AppContext } from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
export class ProfilePage extends BasePageWeb<void, void> {
    public render() {
        const appContext = (StoreUtils.getAppContext(Sf.store.getState()) as AppContext);
        const user = appContext.getUser();
        return (
            <CustomerWebPage>
                <ProfileViewer
                    object={MetadataConstants.object_user}
                    recordId={user.id}
                />
            </CustomerWebPage>
        );
    }
}
