import React from 'react';
import { sourcebitDataClient } from 'sourcebit-target-next';
import _ from 'lodash';
import { slimProps, attachImageDims } from '../utils';

/**
 * In next.js we can't use `src/pages/[...slug].js` for root site page `/`.
 * Instead, we import and export the [...slug].js while overriding its getStaticProps.
 */

import Page from './[...slug]';


export async function getStaticProps({ params }) {
    console.log('Page [index] getStaticProps, params: ', params);
    const props = await sourcebitDataClient.getStaticPropsForPageAtPath('/');
    const assets = _.filter((await sourcebitDataClient.getData()).objects, object => _.get(object, '__metadata.modelName') === '__asset');
    return { props: attachImageDims(slimProps(props), assets) };
}

export default Page;
