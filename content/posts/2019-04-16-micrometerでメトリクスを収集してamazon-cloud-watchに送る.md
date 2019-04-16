---
template: post
title: Micrometerでメトリクスを収集してAmazon Cloud Watchに送る
slug: /posts/micrometer-cloudwatch/
draft: true
date: 2019-04-16T10:08:13.317Z
description: '仕事でMicrometer使う機会が出来たので触ってみました。  '
category: Metrics
tags:
  - Micrometer
---
仕事でMicrometer使う機会が出来たので触ってみました。  

# Micrometerとは？
Micrometerとは、Pivotal社が作っているJVMベースのアプリケーションのためのメトリクスライブラリです。メトリクスの収集とモニタリングシステムへの通知を行います。  
メトリスクの収集(micrometer-core)とモニタリングシステムへの通知(micrometer-registry-xxx)が切り離されているので、モニタリングシステムに依存しません。

## Micrometerを使う上で押さえておくべきクラス
- Meter  
メトリクスの集合を表すクラス。収集方法ごとにクラスがあります。主に使うCounter、Gauge、Timerについては少し詳しく書きます。(Timer, Counter, Gauge, DistributionSummary, LongTaskTimer, FunctionCounter, FunctionTimer, TimeGauge)  
  - Counter    
    固定値が増えていくような計測に使う。  

  - Gauge  
    現在の値の計測に使う。実行中のスレッド数を計測するときなど。  

  - Timer  
    イベントのレイテンシや頻度の計測に使う。指定期間内の合計時間やイベント数を計測するときなど。

- MeterRegistry  
Meterを管理するクラス。モニタリングシステムごとに実装があります。  

- MeterBinder  
メトリクスを収集する方法を登録するクラス。収集対象ごとにクラスがあります。  

## ネーミングルール
Micrometerのメトリック名は小文字でかつドットつなぎでつけます。（例：jvm.memory.used）  
モニタリングシステムに送る際にMicrometer側でそれぞれのモニタリングシステムのネーミングルールに変換して送ります。

```
Prometheus - http_server_requests_duration_seconds
Atlas - httpServerRequests
Graphite - http.server.requests
InfluxDB - http_server_requests
```

# Spring BootでMicrometerを使う
Spring Boot2.0からメトリクスAPIを提供しなくなりました。代わりにMicrometerを使うようになりました。Actuatorを依存関係に追加するだけでMicrometerが使えるようになります。
[Spring Boot 2.0 リリースノート](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes#micrometer)  
Spring Boot 1.5.xでは[Micrometerを依存関係に追加](https://micrometer.io/docs/ref/spring/1.5)すれば使えます。  

## デフォルトで使えるモニタリングシステム
Runtime時にこれらの全モニタリングシステムの設定をAutoConfigurationで設定します。

- Atlas
- Datadog
- Ganglia
- Graphite
- Influx
- JMX
- New Relic
- Prometheus
- SignalFx
- StatsD
- Wavefront

## その他の対応しているモニタリングシステム
- AppOptics
- Azure Monitor
- Cloud Watch
- Dynatrace
- Elastic
- Humio
- Kairos
- Stackdriver

## サポートしているメトリクス
- JVMメトリクス
- CPUメトリクス
- ファイルディスクリプタメトリクス
- Logbackメトリクス
- Uptimeメトリクス
- Tomcatメトリクス
- Spring Integrationメトリクス

デフォルトだと `/actuator/metrics` を叩くと利用可能なメータを確認することができます。  

# メトリクスを収集してAmazon Cloud Watchに送る
今回の技術スタックはこんな感じです。
```
Spring Boot 2.1.3
Amazon Cloud Watch
```

## 依存関係を追加
```
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.cloud:spring-cloud-starter-aws'
    implementation 'io.micrometer:micrometer-registry-cloudwatch'
}
```

## 設定を追加
```
management:
  metrics:
    use-global-registry: false
    export:
      cloudwatch:
        namespace: Micrometer/test
        enable: true
        step: 1s
cloud:
  aws:
    stack:
      auto: false
    region:
      auto: false
      static: ap-northeast-1
```

`management.metrics.use-global-registry=false` でデフォルトで使える全モニタリングシステムを無効にします。  
`management.metrics.export.cloudwatch.namespace=Micrometer/test` ネームスペースを `Micrometer/test` にします。  
`management.metrics.export.cloudwatch.enable=true` MicrometerでCloud Watchを使うための設定をAutoConfigurationで設定してもらいます。  
`management.metrics.export.cloudwatch.step=1s` メトリクスの収集間隔を1秒にします。  

`cloud.aws.*` は、spring-cloud-awsを使っているアプリケーションをローカルで起動するための設定です。spring-cloud-awsは、S3やCloudFormationなど様々なサービスと連携します。AWS環境でアプリケーションが起動していない場合、Exceptionを投げれられてアプリケーションが起動しません。  
`cloud.aws.stack.auto=false` CloudFormationとの連携を無効にする。  
`cloud.aws.region.auto=false` 、 `cloud.aws.region.static=ap-northeast-1` EC2のメタデータからリージョンを自動で取得せずに `ap-northeast-1` をリージョンに指定しています。  

## Elastic Beanstalkにデプロイ
Coineyでは、Elastic Beanstalkを使っているので同様の環境にデプロイします。デフォルトで55個のメトリクスが収集されます。

## 独自Metricsクラスを実装
`management.metrics.enable.xx=false` のように書くことで不要なメトリクスを収集しないようにできます。（xxは、メトリクス名のプレフィックスでjvmやtomcatなどがあります）  

今回は、ヒープの使用量のメトリクスを収集する独自Metricsクラスを実装します。

```
@ConditionalOnAwsCloudEnvironment
@Component
public class HeapMemoryUsageMetrics {
  public HeapMemoryUsageMetrics(MeterRegistry registry) {
    Gauge.builder("HeapMemoryUsage", this, HeapMemoryUsageMetrics::invoke)
      .tag("InstanceId", EC2MetadataUtils.getInstanceId())
      .baseUnit("bytes")
      .register(registry);
  }
  private Long invoke() {
    MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
      return memoryMXBean.getHeapMemoryUsage().getUsed();
  }
}
```

特に難しいことはしていないです。 AWS環境以外では、このクラスのインスタンスをBean登録する必要がないので、 `@ConditionalOnAwsCloudEnvironment` をつけて、AWS環境のときのみBean登録します。
