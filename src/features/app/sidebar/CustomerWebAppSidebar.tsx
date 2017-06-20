import './CustomerWebAppSidebarStyles.scss';
import { AdminSwitcher } from '@swish/ui-components';
import { AppContext } from '@swish/ui-components';
import { AppMenu } from '@swish/ui-components';
import { BaseComponent, NavTreeNode, NavTree } from '@swish/ui-components';
import { MetadataConstants } from '@swish/ui-common';
import { Sf } from '@swish/ui-common';
import { Utils } from '@swish/ui-components';
import * as React from 'react';

export interface CustomerWebAppSidebarProps {
    currentUrl?: string;
    appContext: AppContext;
}

export interface CustomerWebAppSidebarState {
    menuTreeNodes: NavTreeNode[];
}

export class CustomerWebAppSidebar extends BaseComponent<CustomerWebAppSidebarProps, CustomerWebAppSidebarState> {

    constructor(props: CustomerWebAppSidebarProps) {
        super(props, { menuTreeNodes: CustomerWebAppSidebar.buildMenuTreeNodes(props.appContext)});
    }

    /**
     * Constructs the menu applicable for current user based on the user's access.
     */
    // tslint:disable:no-increment-decrement
    private static buildMenuTreeNodes(appContext: AppContext): NavTreeNode[] {
        const navTreeNodes: NavTreeNode[] = [];
        let counter = 0;
        //Home menu is always shown
        navTreeNodes.push({ id: '' + (counter++), label: 'Home', url: '/customer/home'});

        if (!appContext.getAppMenus() || Utils.isBlank(appContext.getAppMenus())) {
            return navTreeNodes;
        }

        const appMenu: AppMenu = (appContext.getAppMenus() as AppMenu[]) [0];
        if (appMenu.content && appMenu.content.children) {
            appMenu.content.children.forEach(menuItem => {
                if (menuItem.type === MetadataConstants.app_menu_type_object) {
                    const navNode: NavTreeNode =  {
                        id: '' + (counter++),
                        label: menuItem.label,
                    };

                    const objectHomeUrl = `/customer/objects/${menuItem.value}`;
                    navNode.url = objectHomeUrl;
                    navTreeNodes.push(navNode);
                }
            });
        }

        return navTreeNodes;
    }

    public render() {
        const state = this.state;
        const props = this.props;

        return (
            <div>
                {
                    props.appContext.hasPermission(MetadataConstants.perm_metadata_customize_application)
                    &&
                    <AdminSwitcher mode='app' className='sui-admin-switcher'/>
                }
                <NavTree currentUrl={props.currentUrl} value={state.menuTreeNodes}/>
            </div>
        );
    }

}
