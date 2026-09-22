const _ = require('lodash');
const pathPrefix = '/';

function withContentfulImageParams(url, imageOptions) {
    if (!_.startsWith(url, 'https://images.ctfassets.net')) {
        return url;
    }
    const params = ['fm=webp', 'q=75'];
    if (_.get(imageOptions, 'w')) params.push('w=' + imageOptions.w);
    if (_.get(imageOptions, 'h')) params.push('h=' + imageOptions.h);
    if (_.get(imageOptions, 'fit')) params.push('fit=' + imageOptions.fit);
    if (_.get(imageOptions, 'focus')) params.push('f=' + imageOptions.focus);
    const separator = _.includes(url, '?') ? '&' : '?';
    return url + separator + params.join('&');
}

export default function withPrefix(url, imageOptions) {
    if (!url) {
        return url;
    }

    if (_.startsWith(url, '#')) {
        return url;
    }
    if (_.startsWith(url, 'http://') || _.startsWith(url, 'https://')) {
        return withContentfulImageParams(url, imageOptions);
    }
    const basePath = _.trim(pathPrefix, '/');
    return '/' + _.compact([basePath, _.trimStart(url, '/')]).join('/');
}
