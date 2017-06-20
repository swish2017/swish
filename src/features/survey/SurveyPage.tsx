import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import { CustomerWebPage } from '../../components/pages/CustomerWebPage';
import {Survey, SurveyValue, SurveyModel} from '@swish/ui-components';
import {Card} from '@swish/ui-components';
import {Button} from '@swish/ui-components';
import {Sf} from '@swish/ui-common';
import './SurveyPageStyles.scss';

//tslint:disable:max-line-length
const SURVEY_DATA: SurveyModel = { "name": "vehicle_sales", "territory": "San Francisco", "active": true, "version": 1, "content": [{ "id": "1", "name": "", "question": "Issue with your commute?", "answers": [{ "id": "1a", "text": "Yes", "parent": "1", "destination": "2" }, { "id": "1b", "text": "No", "parent": "1", "destination": "T" } ] }, { "id": "2", "question": "Would you like to buy or lease a vehicle?", "answers": [{ "id": "2a", "text": "Buy", "parent": "2", "destination": "3", "image": "http://nxworld.net/codepen/css-image-hover-effects/pic01.jpg" }, { "id": "2b", "text": "Lease", "parent": "2", "destination": "6", "image": "http://nxworld.net/codepen/css-image-hover-effects/pic02.jpg" } ] }, { "id": "3", "question": "Do you prefer a car?", "answers": [{ "id": "3a", "text": "No", "parent": "3", "destination": "T" }, { "id": "3b", "text": "Yes", "parent": "3", "destination": "6" } ] }, { "id": "6", "question": "When are you ready to make a purchase?", "answers": [{ "id": "6a", "text": "Now", "parent": "6", "destination": "T" }, { "id": "6b", "text": "1-3 months", "parent": "3", "destination": "T" }, { "id": "6c", "text": "Not sure", "parent": "3", "destination": "T" } ] } ] } ;

export interface SurveyPageState {
    value: SurveyValue[];
    hasSurveyStarted?: boolean;
}

export class SurveyPage extends BaseComponent<void, SurveyPageState> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        const state = this.state;

        //FIXME : get backgroundImage from settings
        const backgroundImage = 'http://www.seattletonics.com/images/banner-01.jpg';
        return (
            <CustomerWebPage className='sui-surveywebpage'>
                {
                    (!state.hasSurveyStarted) ?
                        <Card className='survey-infocard' backgroundImage={backgroundImage} width='500px' >
                            <div className='survey-start-actions'>
                                <Button label='Take Survey' intent='primary' onClick={() => this.updateState({hasSurveyStarted: true})}/>
                            </div>
                        </Card>
                    : <Survey value={state.value}
                            model={SURVEY_DATA}
                            onSurveyFinish={() => this.onSurveyFinish()}
                            onChange={(value) => this.updateState({value})}/>
                }
            </CustomerWebPage>
        );
    }

    private onSurveyFinish = () => {
        const state = this.state;
        const surveyId = 'ssurevy00000000000001';
        localStorage.setItem(`survey/${surveyId}`, JSON.stringify(state.value));
        Sf.nav.navTo(`/customer/${surveyId}/products`);
    }

}
