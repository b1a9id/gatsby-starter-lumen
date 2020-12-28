---
template: post
title: Spring Boot 2.4とSpring Cloud 2020.0.0
slug: /posts/spring-boot-24-and-spring-cloud-2020-0-0
draft: true
date: 2020-12-28T03:12:35.872Z
description: Spring Boot 2.4とSpring Cloud 2020.0.0
category: Upgrade
tags:
  - SpringBoot
  - SpringCloud
---
Spring Boot 2.4とSpring Cloud 2020.0.0がリリースされました！変更点多くて、毎回ドキュメント探しにいくの辛いのでざっくりまとめます。
**自分に関係するところくらいしかかかないので、公式ドキュメントをちゃんと読むことをおすすめします。**

# Spring Boot 2.4
[リリースノート](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.4-Release-Notes)を読んでみる。

## JUnit 5のVintage Engineが依存関係から外れた
JUnit 4以前のバージョンでテスト書いてる場合は、`junit-vintage-engine`を依存関係に追加する。

## Spring Bootの設定ファイル周りの変更
### TODO:jar外からの設定インポート
`spring.cloud.location`と`spring.config.import`はファイルやディレクトリが存在しないときに静かに起動失敗しなくなった。
ファイルやディレクトリが存在しないときに起動失敗させないようにするために、`optional:`プレフィックをつければよい。
全てのロケーションをオプションにしたい場合は、`SpringApplication.setDefaultProperties(...)`で`spring.config.on-not-found=ignore`を指定するか、システム変数や環境変数で設定する。

### 設定ファイルのChangelog
[Spring Boot 2.4.0 Configuration Changelog](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.4.0-Configuration-Changelog)

### 設定ファイルのマイグレーションガイド
[Spring Boot Config Data Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-Config-Data-Migration-Guide)

#### レガシーモードを使う
```
spring.config.use-legacy-processing=true
```

#### TODO:プロファイルが指定された設定ファイル
`spring.profiles`プロパティを利用している場合、`spring.config.activate.on-profile`に書き換える必要がある。


#### TODO:プロファイルグループ
Spring Boot 2.3以前でこのように書き、`java -jar --spring.profiles.active=debug`のように`debug`を指定すれば、`debugdb`と`debugcloud`もアクティベートされた。
```
spring.profiles: "debug"
spring.profiles.include: "debugdb,debugcloud"
```

同様のことをするなら、このように書き換える必要がある。
```
spring:
  config:
    activate:
      on-profile: "debug"
  profiles:
    include: "debugdb,debugcloud"
```
もしくは、こう書く。
```
spring:
  profiles:
    group:
      "debug": "debugdb,debugcloud"
```

#### まとめ
`application.yml`, `application-prod.yml`があって`-Dspring.profiles.active=prod`オプションをつけて起動すれば、これまで通りで変わらない。
`application.yml`の1ファイルにして全ての外部ファイルをから上書きしたい場合は、変更が必要。

## Logback
プロパティが変更された。
[Logback Configuration Properties](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.4-Release-Notes#logback-configuration-properties)

## Flyway
Spring Boot 2.4ではFlyway 7になる。Flyway 5を利用している場合は、一旦Flyway 6に上げてからFlyway 7にする。

## Spring Boot Gradle Plugin
bootJarタスクのmailClassプロパティが変更になった。

Spring Boot 2.3以前
```
bootJar {
    mainClassName 'com.example.ExampleApplication'
}
```

Spring Boot 2.4
```
bootJar {
    mainClass 'com.example.ExampleApplication'
}
```

## Spring Framework 5.3
Spring Boot 2.4ではSpring Framework 5.3を使っている。
[What's New in Version 5.3](https://github.com/spring-projects/spring-framework/wiki/What's-New-in-Spring-Framework-5.x#whats-new-in-version-53)

### Jackson2ObjectMapperBuilderでConsumer<ObjectMapper>でObjectMapperをカスタマイズできる
タイトルの通り

### TODO:Spring MVCでPathPatterを用いてのURLマッチング
[URL Matching with PathPattern in Spring MVC](https://spring.io/blog/2020/06/30/url-matching-with-pathpattern-in-spring-mvc)

### TODO:spring.test.constructor.autowire.mode
デフォルトの`@TestConstructor` autorwiring modeを変更するためにJUnit Platformの設定(junit-platform.properties)経由で`spring.test.constructor.autowire.mode`を設定できる。

## Spring Data 2020.0
Spring Boot 2.4ではSpring Data 2020.0を使っている。
[Release Train Ockham (2020.0.0)](https://github.com/spring-projects/spring-data-commons/wiki/Release-Train-Ockham-(2020.0.0))

## TODO:Startup Endpoint
actuatorで`startup`エンドポイントが利用できるようになった。アプリケーション起動時の情報が見れる。

## Spring Security
Spring Boot 2.4ではSpring Security 5.4を使っている。
(whats' new)[https://docs.spring.io/spring-security/site/docs/5.4.0/reference/html5/#new]
