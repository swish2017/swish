import * as React from 'react';
import {BaseComponent} from '@swish/ui-components';
import { CustomerWebPage } from '../../components/pages/CustomerWebPage';
import {Card} from '@swish/ui-components';
import {Grid, GridColumn, GridRow} from '@swish/ui-components';

export interface ProductPageProps {
    surveyId?: string;
}

const PRODUCT_DATA = [
    {id: 1, image: 'https://images-na.ssl-images-amazon.com/images/I/61jTlnxey6L._SL1000_.jpg', title: 'Fire HD 8 Tablet with Alexa, 8" HD Display, 16 GB, Tangerine - with Special Offers', description: 'Fire HD 8 features a widescreen 1280 x 800 high-definition display with over a million pixels (189 ppi) and a bright, vivid picture. Enjoy movies and games in a crisp, clear HD resolution, with less glare and more brightness thanks to a stunning IPS (in-plane-switching) LCD display.'},
    {id: 2, image: 'https://images-na.ssl-images-amazon.com/images/I/51ioMN1tPKL.jpg', title: 'Apple MacBook Pro MD101LL/A 13.3-Inch Laptop', description: 'The MacBook Pro packs plenty of power thanks to the latest Intel Core i5 processor, which features a faster processor, more powerful graphics, and a memory controller integrated into a single chip. The third-generation dual-core Intel Core i5 has a 2.5 GHz speed, which can dynamically accelerate up to 3.1 GHz to match your workload thanks to updated Intel Turbo Boost Technology.'},
    {id: 3, image: 'https://images-na.ssl-images-amazon.com/images/I/811TGMEGFHL._SL1500_.jpg', title: 'Bushnell Legend Ultra HD Roof Prism Binocular', description: 'Rain guard HD water-repellent lens coating, Lightweight, magnesium chassis Waterproof & fog proof Includes a soft carrying case, Microfiber carry bag & neck strap 10x magnification, 42mm objective lens binoculars Exceptional optics with ED Prime Glass, Ultra Wide Band Coatings, and RainGuard HD water-repellent lens coating'},
];

export class ProductPage extends BaseComponent<ProductPageProps, void> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <CustomerWebPage>
                <div>Product List</div>
                <br />
                {
                    PRODUCT_DATA.map((product: any) => {
                        return (
                            <Card>
                                <Grid>
                                    <GridRow>
                                        <GridColumn columns={4}>
                                            <img src={product.image} height='200' width='200' />
                                        </GridColumn>
                                        <GridColumn columns={8}>
                                            <h3>{product.title}</h3>
                                            <p>{product.description}</p>
                                        </GridColumn>
                                    </GridRow>
                                </Grid>
                            </Card>
                        );
                    })
                }
            </CustomerWebPage>
        );
    }

}
