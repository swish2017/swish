import {Events, Sf, PageInfo} from '@swish/ui-common';
import {BaseComponent} from '@swish/ui-components';

export abstract class BasePageWeb<P, S> extends BaseComponent<P, S> {
    protected publishPageInfo (pageInfo: PageInfo) {
        //Since title object key and param are named same, unless we quote, it will not work.
        Sf.event.publish(Events.UI_PAGE_INFO, pageInfo);
    }
}