import React from 'react';
import {Helmet} from 'react-helmet';
import _ from 'lodash';

import {withPrefix, attribute} from '../utils';
import Header from './Header';
import Footer from './Footer';

export default class Body extends React.Component {
    render() {
        let font = _.get(this.props, 'data.config.base_font', null) || 'nunito-sans';
        return (
            <React.Fragment>
                <Helmet>
                    <html lang="en"/>
                    <title>{_.get(this.props, 'page.seo.title', null) ? (_.get(this.props, 'page.seo.title', null)) : _.get(this.props, 'page.title', null) + ' | ' + _.get(this.props, 'data.config.title', null)}</title>
                    <meta name="google" content="notranslate" />
                    <meta name="description" content={_.get(this.props, 'page.seo.description', null) || ''} />
                    {_.get(this.props, 'page.seo.robots', null) && (
                    <meta name="robots" content={_.join(_.get(this.props, 'page.seo.robots', null), ',')}/>
                    )}
                    {(() => {
                        const customCanonical = _.get(this.props, 'page.seo.canonicalUrl', null);
                        if (customCanonical) {
                            return <link rel="canonical" href={customCanonical}/>;
                        }
                        const domain = _.trim(_.get(this.props, 'data.config.domain', null), '/');
                        if (!domain) {
                            return null;
                        }
                        const urlPath = withPrefix(_.get(this.props, 'page.stackbit_url_path', '/')).replace(/\/?$/, '/');
                        return <link rel="canonical" href={domain + urlPath}/>;
                    })()}
                    {_.map(_.get(this.props, 'page.seo.extra', null), (meta, meta_idx) => {
                        let key_name = _.get(meta, 'keyName', null) || 'name';
                        return (
                          _.get(meta, 'relativeUrl', null) ? (
                            _.get(this.props, 'data.config.domain', null) && ((() => {
                                let domain = _.trim(_.get(this.props, 'data.config.domain', null), '/');
                                let rel_url = withPrefix(_.get(meta, 'value', null));
                                let full_url = domain + rel_url;
                                return (
                                  <meta key={meta_idx} {...(attribute(key_name, _.get(meta, 'name', null)))} content={full_url}/>
                                );
                            })())
                          ) : 
                            <meta key={meta_idx + '.1'} {...(attribute(key_name, _.get(meta, 'name', null)))} content={_.get(meta, 'value', null)}/>
                        )
                    })}
                    {(font !== 'system-sans') && (
                    <link rel="preconnect" href="https://fonts.gstatic.com"/>
                    )}
                    {(font === 'nunito-sans') ? (
                    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"/>
                    ) : ((font === 'fira-sans') && (
                    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet"/>
                    ))}
                    {_.get(this.props, 'data.config.favicon', null) && (
                    <link rel="icon" href={withPrefix(_.get(this.props, 'data.config.favicon', null))}/>
                    )}
                    {(() => {
                        const domain = _.trim(_.get(this.props, 'data.config.domain', null), '/');
                        if (!domain) {
                            return null;
                        }
                        const favicon = _.get(this.props, 'data.config.favicon', null);
                        const logoUrl = favicon ? (/^https?:\/\//.test(favicon) ? favicon : domain + withPrefix(favicon)) : undefined;
                        const brandName = _.get(this.props, 'data.config.title', null) || undefined;
                        const orgId = domain + '/#organization';

                        const configPhone = _.get(this.props, 'data.config.phone', null);
                        const configDubaiAddress = _.get(this.props, 'data.config.office_address_dubai', null);
                        const configAbuDhabiAddress = _.get(this.props, 'data.config.office_address_abu_dhabi', null);
                        const configSocialLinks = _.get(this.props, 'data.config.social_links', null);

                        const addresses = [];
                        if (configDubaiAddress) {
                            addresses.push({ '@type': 'PostalAddress', streetAddress: configDubaiAddress, addressCountry: 'AE' });
                        }
                        if (configAbuDhabiAddress) {
                            addresses.push({ '@type': 'PostalAddress', streetAddress: configAbuDhabiAddress, addressCountry: 'AE' });
                        }

                        const localBusinessSchema = {
                            '@context': 'https://schema.org',
                            '@type': 'LocalBusiness',
                            '@id': orgId,
                            name: brandName,
                            url: domain + '/',
                            logo: logoUrl,
                            image: logoUrl,
                            telephone: configPhone || '+971504948135',
                            sameAs: (configSocialLinks && configSocialLinks.length) ? configSocialLinks : [
                                'https://www.facebook.com/pakistancargouae',
                                'https://twitter.com/Pakistani_cargo',
                                'https://www.linkedin.com/company/pakistancargo',
                                'https://www.instagram.com/pakistanicargo'
                            ],
                            address: addresses.length ? addresses : undefined,
                            areaServed: [
                                {'@type': 'City', name: 'Dubai'},
                                {'@type': 'City', name: 'Abu Dhabi'},
                                {'@type': 'City', name: 'Sharjah'},
                                {'@type': 'Country', name: 'Pakistan'}
                            ]
                        };

                        const urlPath = withPrefix(_.get(this.props, 'page.stackbit_url_path', '/')).replace(/\/?$/, '/');
                        const pageUrl = domain + urlPath;

                        const SERVICE_PAGES = {
                            'sea-cargo/': 'Sea Cargo Shipping',
                            'air-cargo-to-pakistan/': 'Air Cargo Shipping',
                            'courier-to-pakistan/': 'Courier Service',
                            'packing-services/': 'Packing Services',
                            'cargo-to-pakistan/': 'Cargo Shipping',
                            'cargo-pakistan-from-dubai/': 'Cargo Shipping from Dubai',
                            'cargo-pakistan-from-dbu-dhabi/': 'Cargo Shipping from Abu Dhabi',
                            'pakistan-cargo-abu-dhabi/': 'Cargo Shipping from Abu Dhabi',
                            'pakistan-cargo-mussafah/': 'Cargo Shipping from Mussafah',
                            'pricing/': 'Cargo Shipping Rates'
                        };
                        const trimmedPath = _.trim(_.get(this.props, 'page.stackbit_url_path', ''), '/') + '/';
                        const serviceName = SERVICE_PAGES[trimmedPath];
                        const serviceSchema = serviceName ? {
                            '@context': 'https://schema.org',
                            '@type': 'Service',
                            serviceType: serviceName,
                            name: serviceName,
                            provider: {'@id': orgId},
                            areaServed: {'@type': 'Country', name: 'Pakistan'},
                            url: pageUrl
                        } : null;

                        const modelName = _.get(this.props, 'page.__metadata.modelName', null);
                        let blogSchema = null;
                        if (modelName === 'post') {
                            const author = _.get(this.props, 'page.author', null);
                            const authorName = author ? _.trim((author.first_name || '') + (author.last_name || '')) : null;
                            blogSchema = {
                                '@context': 'https://schema.org',
                                '@type': 'BlogPosting',
                                headline: _.get(this.props, 'page.title', null),
                                url: pageUrl,
                                datePublished: _.get(this.props, 'page.date', null) || undefined,
                                dateModified: _.get(this.props, 'page.date', null) || undefined,
                                author: {'@type': 'Organization', name: authorName || brandName},
                                publisher: {
                                    '@type': 'Organization',
                                    name: brandName,
                                    logo: logoUrl ? {'@type': 'ImageObject', url: logoUrl} : undefined
                                },
                                mainEntityOfPage: {'@type': 'WebPage', '@id': pageUrl}
                            };
                        }

                        const schemaScripts = [
                            <script key="schema-localbusiness" type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
                        ];
                        if (serviceSchema) {
                            schemaScripts.push(<script key="schema-service" type="application/ld+json">{JSON.stringify(serviceSchema)}</script>);
                        }
                        if (blogSchema) {
                            schemaScripts.push(<script key="schema-blogposting" type="application/ld+json">{JSON.stringify(blogSchema)}</script>);
                        }
                        return schemaScripts;
                    })()}
                    <body className={'palette-' + _.get(this.props, 'data.config.palette', null) + ' font-' + _.get(this.props, 'data.config.base_font', null)} />
                </Helmet>
                <div id="page" className="site">
                  <Header {...this.props} />
                  <main id="content" className="site-content">
                    {this.props.children}
                  </main>
                  <Footer {...this.props} />
                </div>
            </React.Fragment>
        );
    }
}
