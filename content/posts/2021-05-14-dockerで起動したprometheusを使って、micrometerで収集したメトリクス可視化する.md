---
template: post
title: Dockerで起動したPrometheusを使って、Micrometerで収集したメトリクス可視化する
slug: /micrometer-prometheus-in-docker
draft: true
date: 2021-05-14T04:14:20.291Z
description: メトリクス収集対象のアプリケーションを作ります。今回はSpring Bootで作ります。
category: Metrics
tags:
  - Micrometer
  - Prometheus
---
Amazon Managed Service for Prometheusが値下げされるという [記事](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/aws-announces-a-price-reduction-for-amazon-managed-service-for-prometheus-amp/) を見かけて、「そろそろMicrometerのモニタリングシステムをCloud Watchから乗り換えるか」って気持ちになったのでPrometheusをサクッと試してみました。

## アプリケーション作成
メトリクス収集対象のアプリケーションを作ります。今回はSpring Bootで作ります。

まず、build.gradleの依存関係です。PrometheusがActuatorのエンドポイントを叩いてメトリクス情報を収集します。  
`gist:b1a9id/155d264ece704ba74bc1d6a6e7f6b190?file=build.gradle` 

次に、アプリケーションの実装です。  
`gist:b1a9id/e1fd07caa554e501fc58e1059e5f74f3?file=IndexController.java`  
アプリケーションを起動して、`GET http://localhost:8080`を叩くと次のようなレスポンスが返ってきます。  
`gist:b1a9id/6fcc243a9e937106656d284ec6811450?file=index.json`  

