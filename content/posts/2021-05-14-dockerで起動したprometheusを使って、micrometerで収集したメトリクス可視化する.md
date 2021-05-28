---
template: post
title: Docker上で起動したPrometheusを使って、Micrometerで収集したメトリクス可視化する
slug: /micrometer-prometheus-in-docker
draft: true
date: 2021-05-28T07:44:22.584Z
description: >-
  Amazon Managed Service for
  Prometheusが値下げされるという[記事](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/aws-announces-a-price-reduction-for-amazon-managed-service-for-prometheus-amp/)
  を見かけて、「そろそろMicrometerのモニタリングシステムをCloud
  Watchから乗り換えるか」って気持ちになったのでPrometheusをサクッと試してみました。

  メトリクス収集対象のアプリケーションを作ります。今回はSpring Bootで作ります。
category: Metrics
tags:
  - Micrometer
  - Prometheus
---
Amazon Managed Service for Prometheusが値下げされるという [記事](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/aws-announces-a-price-reduction-for-amazon-managed-service-for-prometheus-amp/) を見かけて、「そろそろMicrometerのモニタリングシステムをCloud Watchから乗り換えるか」って気持ちになったのでPrometheusをサクッと試してみました。

## Prometheusとは

Prometheusは、SoundCloudが2012年に作ったOSSのシステムモニタリングとアラートのツールです。

### 機能

* メトリクス名とkey/valueペアによって識別された時系列データを持つ多次元のデータモデル
* この次元を利用するための柔軟性のあるクエリ言語のPromQLを提供
* 依存しない分散型ストレージ。シングルサーバノードが独立している
* メトリクスの収集方法はプル型
* 中間ゲートウェイ経由でプッシュ型もサポートしている
* サービスディスカバリや静的な設定経由で、ターゲットが検出される
* グラフ化やダッシュボード化のいくつかのモードをサポートしている

### コンポーネント

Prometheusのエコシステムは複数のコンポーネントから成り立つ

* メインのPrometheusサーバは時系列データを取得して保存する
* 計測するアプリケーションコードのためのクライアントライブラリ
* 一時的なジョブをサポートするためのプッシュゲートウェイ
* HAProxy, StatsD, Graphite, などのようなサービスのための特別な目的のエクスポーターズ
* アラートを扱うためのアラートマネージャ
* 多くのPrometheusコンポーネントはgolangで書かれている

## Micrometerとは
以前書いた [Micrometerでメトリクスを収集してAmazon Cloud Watchで可視化する](https://www.b1a9idps.com/posts/micrometer-cloudwatch/) にまとめてあるので省略。

## アプリケーション作成

メトリクス収集対象のアプリケーションを作ります。今回はSpring Bootで作ります。

まず、build.gradleの依存関係です。PrometheusがActuatorのエンドポイントを叩いてメトリクス情報を収集します。\
`gist:b1a9id/155d264ece704ba74bc1d6a6e7f6b190?file=build.gradle` 

次に、アプリケーションの実装です。\
`gist:b1a9id/e1fd07caa554e501fc58e1059e5f74f3?file=IndexController.java`\
アプリケーションを起動して、`GET http://localhost:8080`を叩くと次のようなレスポンスが返ってきます。\
`gist:b1a9id/6fcc243a9e937106656d284ec6811450?file=index.json`  

次に、Actuatorの `GET /actuator/prometheus` エンドポイントを有効にします。Prometheusがこのエンドポイントを叩いてメトリクス情報を収集します。\
`gist:b1a9id/bf99fe3d66d73fa6dc7f86267610ae82?file=application.yml`\
`GET http://localhost/actuator/prometheus`を叩くと、Prometheusのフォーマットでメトリクス情報が返ってきます。

## Dockerコンテナで起動

docker-compose.ymlを用意して、先に実装したアプリケーションとPrometheusをDockerコンテナ上で起動するようにします。
`gist:b1a9id/817e5b25afd643813246d72fe64f9954?file=docker-compose.yml`  

次に、Prometheusの設定ファイルを用意します。
ほぼ、Spring Bootのドキュメントにある[サンプル](https://docs.spring.io/spring-boot/docs/2.4.5/reference/html/production-ready-features.html#production-ready-metrics-export-prometheus)通りです。
`gist:b1a9id/c618a1300354d155c041051dcd4b3cb1?file=prometheus.yml`  

次に、[jibのGradleプラグイン](https://github.com/GoogleContainerTools/jib/tree/master/jib-gradle-plugin)を使ってアプリケーションのDockerイメージを作成します。8080番ポートで起動するようにしています。
`gist:b1a9id/f459aa7d98d59da1625252003e05b08e?file=build.gradle`\
`./gradlew jibDockerBuild`でDockerイメージを作成します。  

それでは、コンテナを起動してみましょう。\
`gist:b1a9id/b2b63b449929c39e92e07b6720dad925?file=docker-compose.log`  

リクエストログをみてみると、10秒おきにエンドポイントが叩かれてるのがわかります。
`gist:b1a9id/4203ba1933c1043427f518471c93377f?file=request-log.log`  

## PrometheusのUIを確認
ブラウザで、Prometheusにアクセスすると、UIを見ることできます。
「Expression」にPromQLを入力して「Execute」ボタンを押下すると表示されます。

● Table

![prometheus_table](/media/prometheus_table.png)


● Graph

![prometheus_graph](/media/prometheus_graph.png)

やってみた記事なので、一旦ここまで。

## Links
- [Prometheus](https://prometheus.io/docs/introduction/overview/)
- [Micrometer](https://micrometer.io)
- [micrometer-prometheusレポジトリ]
(https://github.com/b1a9id/micrometer-prometheus)