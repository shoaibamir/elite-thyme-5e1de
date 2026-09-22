const _ = require('lodash');
const pathPrefix = '/';

function withContentfulImageParams(url) {
    if (!_.startsWith(url, 'https://images.ctfassets.net')) {
        return url;
    }
    const separator = _.includes(url, '?') ? '&' : '?';
    return url + separator + 'fm=webp&q=75';
}

export default function withPrefix(url) {
    if (!url) {
        return url;
    }

    if (_.startsWith(url, '#')) {
        return url;
    }
    if (_.startsWith(url, 'http://') || _.startsWith(url, 'https://')) {
        return withContentfulImageParams(url);
    }
    const basePath = _.trim(pathPrefix, '/');
    return '/' + _.compact([basePath, _.trimStart(url, '/')]).join('/');
}
