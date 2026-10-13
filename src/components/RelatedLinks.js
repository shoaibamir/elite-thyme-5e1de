import React from 'react';
import _ from 'lodash';

import {Link} from '../utils';

// Pages are grouped by topic. The first member of each group is its hub.
// A page shows links to other members of its own group (never itself), plus a
// couple of cross-group links to the main service pages. Pages that are not
// listed here (homepage, contact, legal, canonicalized duplicates) render nothing.
const GROUPS = {
    abuDhabi: {
        members: [
            {url: '/cargo-pakistan-from-dbu-dhabi/', anchor: 'Cargo to Pakistan from Abu Dhabi'},
            {url: '/blog/best-cargo-service-in-abu-dhabi/', anchor: 'Best cargo service in Abu Dhabi'},
            {url: '/blog/pakistan-cargo-mussafah/', anchor: 'Pakistan cargo from Mussafah'},
            {url: '/blog/pakistan-cargo-to-karachi-from-abu-dhabi/', anchor: 'Cargo to Karachi from Abu Dhabi'},
            {url: '/blog/pakistan-cargo-to-lahore-from-abu-dhabi/', anchor: 'Cargo to Lahore from Abu Dhabi'},
            {url: '/blog/pakistan-cargo-to-peshawar-from-abu-dhabi/', anchor: 'Cargo to Peshawar from Abu Dhabi'},
            {url: '/blog/cargo-abu-dhabi-to-pakistan/', anchor: 'Cargo from Abu Dhabi to Pakistan'},
            {url: '/blog/sea-cargo-from-abu-dhabi-to-pakistan/', anchor: 'Sea cargo from Abu Dhabi to Pakistan'},
            {url: '/blog/top-rated-abu-dhabi-to-lahore-shipping-services/', anchor: 'Top-rated Abu Dhabi to Lahore shipping services'}
        ],
        cross: ['/courier-to-pakistan/', '/pricing/']
    },
    dubai: {
        members: [
            {url: '/cargo-pakistan-from-dubai/', anchor: 'Cargo to Pakistan from Dubai'},
            {url: '/pakistan-cargo-sharjah/', anchor: 'Cargo to Pakistan from Sharjah'},
            {url: '/pakistan-cargo-ajman/', anchor: 'Cargo to Pakistan from Ajman'},
            {url: '/blog/sea-cargo-from-dubai-to-pakistan/', anchor: 'Sea cargo from Dubai to Pakistan'},
            {url: '/blog/top-5-cargo-services-from-dubai-to-pakistan/', anchor: 'Top 5 cargo services from Dubai to Pakistan'}
        ],
        cross: ['/courier-to-pakistan/', '/pricing/']
    },
    services: {
        members: [
            {url: '/courier-to-pakistan/', anchor: 'Courier and parcel to Pakistan'},
            {url: '/air-cargo-to-pakistan/', anchor: 'Air cargo to Pakistan'},
            {url: '/sea-cargo/', anchor: 'Sea cargo to Pakistan'},
            {url: '/pricing/', anchor: 'Cargo rates and pricing'},
            {url: '/cargo-to-pakistan/', anchor: 'Shipping to Pakistan'},
            {url: '/blog/how-to-ship-goods-from-uae-to-pakistan-cheaply/', anchor: 'How to ship goods from the UAE to Pakistan cheaply'},
            {url: '/blog/how-to-ship-your-cargo-safely-to-pakistan/', anchor: 'How to ship your cargo safely to Pakistan'},
            {url: '/blog/what-documents-are-required-for-cargo-shipping-to-pakistan/', anchor: 'Documents required for cargo shipping to Pakistan'},
            {url: '/blog/customs-clearance-tips-for-uae-to-pakistan-cargo/', anchor: 'Customs clearance tips for UAE to Pakistan cargo'},
            {url: '/blog/personal-effect-shipping-and-how-it-works/', anchor: 'Personal effects shipping and how it works'},
            {url: '/blog/incoterms/', anchor: 'Incoterms 2020 explained'}
        ],
        cross: ['/cargo-pakistan-from-dubai/', '/cargo-pakistan-from-dbu-dhabi/']
    }
};

const MAX_SIBLINGS = 5;
const MAX_HUB_LINKS = 8;

const normalize = (path) => {
    const trimmed = _.trim(path || '', '/');
    return trimmed ? '/' + trimmed + '/' : '/';
};

const anchorFor = (url) => {
    for (const key of _.keys(GROUPS)) {
        const found = _.find(GROUPS[key].members, {url});
        if (found) {
            return found.anchor;
        }
    }
    return null;
};

export const getRelatedLinks = (path) => {
    const group = _.find(GROUPS, (g) => _.some(g.members, {url: path}));
    if (!group) {
        return [];
    }
    const selfIdx = _.findIndex(group.members, {url: path});
    const hub = group.members[0];
    const rest = group.members.slice(1);

    let links;
    if (selfIdx === 0) {
        links = rest.slice(0, MAX_HUB_LINKS);
    } else {
        // Start after this page and wrap around, so link weight spreads across
        // all members instead of always favouring the first few.
        const k = selfIdx - 1;
        const rotated = rest.slice(k + 1).concat(rest.slice(0, k));
        links = [hub].concat(rotated).slice(0, MAX_SIBLINGS);
    }

    const crossLinks = _.compact(_.map(group.cross, (url) => {
        const anchor = anchorFor(url);
        return anchor ? {url, anchor} : null;
    }));
    return _.uniqBy(links.concat(crossLinks), 'url').filter((l) => l.url !== path);
};

export default class RelatedLinks extends React.Component {
    render() {
        const path = normalize(_.get(this.props, 'page.stackbit_url_path', '/'));
        const links = getRelatedLinks(path);
        if (!links.length) {
            return null;
        }
        return (
            <div className="outer related-links-wrap">
              <div className="inner-medium">
                <nav className="related-links" aria-label="Related pages">
                  <h2 className="related-links-title">Related pages</h2>
                  <ul>
                    {_.map(links, (link) => (
                      <li key={link.url}><Link href={link.url}>{link.anchor}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
        );
    }
}
