import _ from 'lodash';

/**
 * Image sizes for layout-shift-free rendering.
 *
 * Contentful's Images API never upscales: an image requested at width `w` comes
 * back at min(w, original width), scaled proportionally. Giving the <img> that
 * exact width/height lets the browser reserve the space before the file loads,
 * without changing how the image is displayed (the site CSS keeps height:auto).
 */

/**
 * Build-time only. Finds every Contentful asset URL used anywhere in `props`
 * and returns { [url]: { width, height } } for them, using the asset metadata.
 */
export function collectImageDims(props, assets) {
    const known = {};
    _.forEach(assets, asset => {
        const width = _.get(asset, 'dimensions.width');
        const height = _.get(asset, 'dimensions.height');
        if (asset.url && width && height) {
            known[asset.url] = { width, height };
        }
    });
    const found = {};
    (function walk(value) {
        if (_.isString(value)) {
            if (known[value]) {
                found[value] = known[value];
            }
        } else if (_.isObject(value)) {
            _.forEach(value, walk);
        }
    })(props);
    return found;
}

export function attachImageDims(props, assets) {
    return { ...props, imageDims: collectImageDims(props, assets) };
}

/**
 * Attributes that let the browser defer an image until it is near the viewport.
 * Only used for images well below the fold, never for hero or header images.
 */
export function lazyAttrs(lazy) {
    return lazy ? { loading: 'lazy', decoding: 'async' } : {};
}

/**
 * width/height attributes for an image requested at width `w`, or {} when the
 * original size is unknown (the image then renders exactly as before).
 */
export function imageSizeAttrs(imageDims, url, w) {
    const dims = _.get(imageDims, [url]);
    if (!dims || !dims.width || !dims.height) {
        return {};
    }
    const width = Math.min(w, dims.width);
    return { width, height: Math.round(width * dims.height / dims.width) };
}
