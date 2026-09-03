import React from 'react';
import parse, { domToReact, attributesToProps } from 'html-react-parser';
import Link from './link';
import _ from 'lodash';

// Concatenate the raw text content of a node's children. Used only for
// <script> tags, which never contain nested elements, just plain JS text.
function getRawContent(children) {
    return _.map(children, (child) => child.data || '').join('');
}

export default function htmlToReact(html) {
    if (!html) {
        return null;
    }
    const options = {
        replace: (node) => {
            if (node.type === 'script') {
                const props = attributesToProps(node.attribs);
                if (!_.isEmpty(node.children)) {
                    return (
                        <script {...props} dangerouslySetInnerHTML={{ __html: getRawContent(node.children) }} />
                    );
                }
                return <script {...props} />;
            } else if (node.type === 'tag' && node.name === 'a') {
                const href = node.attribs.href;
                const props = _.omit(node.attribs, 'href');
                // use Link only if there are no custom attributes like style, class, and what's not that might break react
                if (_.isEmpty(props)) {
                    return <Link href={href}>{domToReact(node.children, options)}</Link>;
                }
            }
        }
    };
    return parse(html, options);
};
