import React from 'react';
import {
  FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, HatenaShareButton, HatenaIcon
} from 'react-share';
import styles from './Share.module.scss';

const shareProps = {
  via: 'b1a9idps',
  size: 32,
  host: 'https://b1a9idps.com'
};

const Share = ({ articleTitle, slug }) => (
    <div className={styles['social-btns__list']}>
        <FacebookShareButton className={styles['social-btns__list-item']} url={shareProps.host + slug}>
            <FacebookIcon size={shareProps.size} round />
        </FacebookShareButton>
        <TwitterShareButton className={styles['social-btns__list-item']} title={articleTitle} via={shareProps.via} url={`${shareProps.host}${slug}`} >
            <TwitterIcon size={shareProps.size} round />
        </TwitterShareButton>
        <HatenaShareButton className={styles['social-btns__list-item']} url={shareProps.host + slug}>
            <HatenaIcon size={shareProps.size} round />
        </HatenaShareButton>
    </div>
);

export default Share;
