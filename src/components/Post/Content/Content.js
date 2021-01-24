import React from 'react';
import styles from './Content.module.scss';
import Share from '../Share';

const Content = ({ body, title, articleUrl }) => (
  <div className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <Share articleTitle={title} articleUrl={articleUrl} />
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Content;
