import _ from 'lodash';

import getPages from './getPages';

// Fields the blog index and the "Latest Posts" section read from each post.
const POST_FIELDS = ['title', 'date', 'author', 'excerpt', 'thumb_image', 'thumb_image_alt', 'stackbit_url_path'];

/**
 * Every statically generated page used to receive the full content of every
 * page on the site in `props.pages` (about 415 KB of JSON inside each HTML
 * file). Only the blog index and the "Latest Posts" section read `pages`, and
 * only a few fields of each blog post, so every other page gets an empty list.
 */
export default function slimProps(props) {
    const showsPosts = _.get(props, 'page.__metadata.modelName') === 'blog' ||
        _.some(_.get(props, 'page.sections', []), section => _.get(section, 'type') === 'section_posts');
    const pages = showsPosts
        ? _.map(getPages(_.get(props, 'pages', []), '/blog'), post => _.pick(post, POST_FIELDS))
        : [];
    return { ...props, pages };
}
