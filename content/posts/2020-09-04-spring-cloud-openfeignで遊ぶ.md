---
template: post
title: Spring Cloud OpenFeignで遊ぶ
slug: /posts/spring-cloud-open-feign-1
draft: false
date: 2020-09-04T05:35:29.149Z
description: "Spring Cloud OpenFeignの紹介です。先日のSpring Oneで、Unleash the True Power
  of Spring Cloud: Learn How to Customize Spring Cloudで紹介されていたSpring Cloud
  OpenFeignで遊んでみました。 素敵すぎて、もっと早く知りたかった...と感じました。"
category: MVC
tags:
  - Spring Cloud OpenFeign
---
先日のSpring Oneで、[Unleash the True Power of Spring Cloud: Learn How to Customize Spring Cloud](https://springone.io/2020/sessions/unleash-the-true-power-of-spring-cloud-learn-how-to-customize-spring-cloud)で紹介されていたSpring Cloud OpenFeignで遊んでみました。
素敵すぎて、もっと早く知りたかった...と感じました。

## Spring Cloud OpenFeignとは
2018年6月にリリースされたSpring Bootのための[OpenFeign](https://github.com/OpenFeign/feign)インテグレーションです。  
Spring Cloud OpenFeignを使うと宣言的にRESTクライアントを作成することができます。  

## Links
- [公式リファレンス](https://spring.io/projects/spring-cloud-openfeign#overview)  
- [サンプルコード](https://github.com/b1a9id/spring-cloud-openfeign-sample/tree/use-web-mvc)  

## サンプルコード
サンプルで使用しているライブラリ等は次の通りです。  
```
Java 11
Maven
Spring Boot 2.3.3.RELEASE
Spring MVC
Spring Cloud OpenFeign 2.2.5.RELEASE

```

pom.xml  
`gist:b1a9id/5a758c6ef11e12ba452fd32ec5273ed4?file=pom.xml&highlights=13-17`

spring-cloud-starter-openfeignを依存関係に追加してください。

FeignConfig.java  
`gist:b1a9id/e24a5c9a17d613ea0d00c1ecb9be952b?file=FeignConfig.java&highlights=2`

`@EnableFeignClients` を付与することでデフォルト設定を使うことができるようになります。

SakeClient.java  
`gist:b1a9id/27fb717f92af1fc9766562fa513305a0?file=SakeClient.java&highlights=1`

クライアントインターフェースを用意します。コントローラを実装する感覚でインターフェースを書くことができます。  
インターフェースに `@FeignClient` を付与して、コンポーネントスキャンの対象にします。   
```
@FeignClientのプロパティ
- url：リクエスト先のURL。
- name(value)：任意のクライアント名。RibbonロードバランサーやSpring Cloud LoadBalancerを利用する際に使われる。
```

SakeController.java  
`gist:b1a9id/98e5ccbca1d07c35419139c625a308a7?file=SakeController.java`  

クライアントをDIしてメソッドコールするだけです。

## 実行結果
アプリケーションを起動してcurlでAPIを叩いた結果です。

`gist:b1a9id/cc1bdf6a6ebfde988a995bb4c2efa6f4?file=result.txt`

## 補足
### リクエストログをみたい
```
logging.level.[clientが置いてあるパッケージ]=debug
feign.client.config.default.logger-level=basic
```