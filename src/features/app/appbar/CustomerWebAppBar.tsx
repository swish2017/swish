import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import {UIOption} from '@swish/ui-components';
import { AppBarCustomerWeb } from '@swish/ui-components';
import { Sf } from '@swish/ui-common';
import {User} from '@swish/ui-components';
import {Link} from '@swish/ui-components';
import { AppContext } from '@swish/ui-components';
import { AppMenu } from '@swish/ui-components';
import { Utils } from '@swish/ui-components';
import { MetadataConstants } from '@swish/ui-common';
export interface CustomerWebAppBarProps {
    profile: User;
    appContext: AppContext;
}
export interface CustomerWebAppBarState {
    menuNodes: UIOption[];
}
export class CustomerWebAppBar extends BaseComponent<CustomerWebAppBarProps, CustomerWebAppBarState> {
    constructor(props: CustomerWebAppBarProps) {
        super(props, { menuNodes: CustomerWebAppBar.buildMenuNodes(props.appContext)});
    }
    private static buildMenuNodes(appContext: AppContext): UIOption[] {
        const navTreeNodes: UIOption[] = [];
        //Home menu is always shown
        navTreeNodes.push({label: 'Home', value: '', onClick: () => {Sf.nav.navTo('/customer/home'); }});

        if (!appContext.getAppMenus() || Utils.isBlank(appContext.getAppMenus())) {
            return navTreeNodes;
        }

        const appMenu: AppMenu = (appContext.getAppMenus() as AppMenu[]) [0];
        if (appMenu.content && appMenu.content.children) {
            appMenu.content.children.forEach(menuItem => {
                if (menuItem.type === MetadataConstants.app_menu_type_object) {
                    const navNode: UIOption =  {
                        label: menuItem.label,
                        value: '',
                        onClick: () => {
                            Sf.nav.navTo(`/customer/${menuItem.value}`);
                        }
                    };
                    navTreeNodes.push(navNode);
                }
            });
        }
        navTreeNodes.push({label: '', value: ''});
        navTreeNodes.push({label: 'Cart', value: ''});
        navTreeNodes.push({label: 'Order', value: ''});
        navTreeNodes.push({label: 'Favorite', value: ''});
        return navTreeNodes;
    }
    public render() {
        const props = this.props;
        //const state = this.state;
        //menuItems={state.menuNodes}
        return (
           <AppBarCustomerWeb onSearch={() => ''} fixedToTop onShopping  profileMenuItems={this.getProfileMenuItems(props)} name={props.profile.name}/>
        );
    }
    private getProfileMenuItems(props: CustomerWebAppBarProps): UIOption[] {
        return [
            {
                label: 'Your Alerts',
                value: '',
                icon: 'bell',
            },
            {
                label: 'My Profile',
                value: '',
                onClick: () => {
                    Sf.nav.navTo('/customer/profile');
                },
                icon: 'user-circle',
            },
            {
                label: 'Your Survey',
                value: '',
                onClick: () => {
                    Sf.nav.navTo('/customer/survey');
                },
                icon: 'pencil-square-outline',
            },
            {
                label: 'Your Recommendations',
                value: '',
                icon: 'checkbox-empty',
            },
            {
                label: 'Your Subscriptions',
                value: '',
                icon: 'plus-circle',
            },
            {
                label: 'Your Referrals',
                value: '',
                icon: 'trophy',
            },
            {
                label: 'Product List',
                value: '',
                onClick: () => {
                    Sf.nav.navTo('/customer/products');
                },
                icon: 'list-ul',
            },
            {
                label: <Link redirect to='' label='Help and Training'/>,
                value: '',
                icon: 'question-circle',
            },
            {
                label: 'Logout',
                value: '',
                onClick: () => {
                    Sf.authn.logout();
                },
                icon: 'sign-out',
            },
        ];
    }
}
