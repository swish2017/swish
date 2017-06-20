import { HomePage } from '../home';
import { SurveyPage } from '../survey';
import { ProductPage } from '../product';
import { ReferralPage } from '../referral/ReferralPage';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NonIdealStateInvalidRoute } from '@swish/ui-components';
import {CustomerWebLogin} from '../login/CustomerWebLogin';
import { ContactPage } from '../contact/ContactPage';
import { ProfilePage } from '../profile/ProfilePage';
import { ObjectHomePage } from '../object/ObjectHomePage';
import { RecordViewPage } from '../record/RecordViewPage';
import { RecordEditPage } from '../record/recordEditPage';

const getHomePage = (context: any) => {
    return <HomePage/>;
};

const getSurveyPage = (context: any) => {
    return <SurveyPage/>;
};

const getProductPage = (context: any) => {
    return <ProductPage surveyId={context.match.params.surveyId}/>;
};

const getReferralPage = (context: any) => {
    return <ReferralPage object='opportunity' renderMode='add'/>;
}

const getProfilePage = (context: any) => {
    return <ProfilePage/>;
}

const getLoginPage = (context: any) => {
    return <CustomerWebLogin  />;
};

const getContactViewPage = (context: any) => {
    return <ContactPage object='contact' renderMode='view' recordId={context.match.params.recordId}/>;
};
const getContactEditPage = (context: any) => {
    return <ContactPage object='contact' renderMode='edit' recordId={context.match.params.recordId}/>;
};
const getObjectHomePage = (context: any) => {
    return <ObjectHomePage objectIdOrKey={context.match.params.object}/>;
};
const getRecordViewPage = (context: any) => {
    return <RecordViewPage object={context.match.params.object} recordId={context.match.params.recordId}/>;
};
const getRecordNewPage = (context: any) => {
    return <RecordEditPage object={context.match.params.object}/>;
};
const getRecordEditPage = (context: any) => {
    return <RecordEditPage object={context.match.params.object} recordId={context.match.params.recordId}/>;
};

const noRouteError = (context: any) => {
    return <NonIdealStateInvalidRoute route={context.location.pathname || ''} />;
};

export const CustomerWebAppRoutes: React.SFC<void> = (props) => {
    return (
        <div className='sui-page-content'>
            <Switch>
                <Route exact path='/customer' component={getHomePage} />
                <Route exact path='/customer/home' component={getHomePage} />
                <Route exact path='/customer/survey' component={getSurveyPage} />
                <Route exact path='/customer/:surveyId/products' component={getProductPage} />
                <Route exact path='/customer/products' component={getProductPage} />
                <Route exact path='/customer/profile' component={getProfilePage} />
                <Route exact path='/customer/login' component={getLoginPage} />
                <Route exact path='/customer/referral' component={getReferralPage} />
                <Route exact path='/customer/contact/:recordId' component={getContactViewPage} />
                <Route exact path='/customer/contact/:recordId/edit' component={getContactEditPage} />
                <Route exact path='/customer/:object' component={getObjectHomePage} />
                <Route exact path='/customer/:object/new' component={getRecordNewPage} />
                <Route exact path='/customer/:object/:recordId' component={getRecordViewPage} />
                <Route exact path='/customer/:object/:recordId/edit' component={getRecordEditPage} />
                <Route component={noRouteError} />
            </Switch>
        </div>
    );
};
