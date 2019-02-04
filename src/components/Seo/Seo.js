import React from 'react';
import Helmet from 'react-helmet';

import * as config from '../../../config';

export default function Seo({
	isRoot,
	title,
	description,
	postUrl,
}) {
	const type = isRoot ? 'website' : 'article';

	return(
		<Helmet>
			<meta property="og:title" content={title || config.title} />
			<meta property="og:description" content={description || config.subtitle} />

			<meta property="og:url" content={config.url} />
			<meta property="og:type" content={type} />
			<meta property="og:site_name" content={config.title} />
			<meta property="og:image" content={config.blogImageUrl} />
			<meta property="fb:app_id" content={config.facebookAppId} />
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content={`@${config.blogAuthorTwitterUserName}`} />
		</Helmet>
	)
}
