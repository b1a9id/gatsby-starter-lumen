import React from 'react';
import {
  FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, HatenaShareButton, HatenaIcon
} from 'react-share';
import styles from './Share.module.scss';

const shareProps = {
  via: 'b1a9idps',
  size: 32
};

const Share = ({ articleTitle, articleUrl }) => (
    <div className={styles['social-btns__list']}>
        <FacebookShareButton className={styles['social-btns__list-item']} url={articleUrl}>
            <FacebookIcon size={shareProps.size} round />
        </FacebookShareButton>
        <TwitterShareButton className={styles['social-btns__list-item']} title={articleTitle} via={shareProps.via} url={articleUrl} >
            <TwitterIcon size={shareProps.size} round />
        </TwitterShareButton>
        <HatenaShareButton className={styles['social-btns__list-item']} url={articleUrl}>
            <HatenaIcon size={shareProps.size} round />
        </HatenaShareButton>
    </div>
);

export default Share;
