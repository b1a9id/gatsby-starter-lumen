---
template: post
title: springdoc-openapiでAPI Specを生成する
slug: /posts/springdoc-openapi-sample
draft: true
date: 2020-09-12T05:49:15.986Z
description: TEST
category: Document
tags:
  - SpringDocOpenApi
---
こんにちは！  
みなさん、API Spec書いてますか？私はお仕事で、OpenAPI(Swagger)を使って書いています！

ソースコードとドキュメントを別にしてしまうと、実装途中で仕様変更になったときにyml書き直すのが手間だったりAPIの実装と合ってない箇所があったりなどの問題が発生してしまいます。（そもそもyml書くの辛いし）  

プロダクションコードに手を加えることなくプロダクションコードをベースにAPI Specを吐き出すライブラリを探していました。  
いくつかそれっぽいライブラリはあるのですが、プロダクトションコードに設定書かないといけなかったり、テストに設定書かないといけないし（テストコードが全部あるわけじゃない）で要望を完全に満たしてもらえませんでした...  
最近、完全に要望を満たしてくれる [springdoc-openapi](https://springdoc.org) というライブラリを見つけましたので紹介します！！！！！

## springdoc-openapiとは
Spring Bootを利用しているプロジェクトで簡単にOpenAPIのドキュメントを生成してくれるライブラリです。  
Web MVC, WebFluxともに対応しているようです。

```
サポートしているライブラリ
- Open API 3
- Spring Boot(v1 and v2)
- JSR-303, specifically for @NotNull, @Min, @Max, and @Size.
- Swagger-ui
- OAuth 2
```

## サンプルコード
今回は、Web MVCでのサンプルコードを紹介します。

### API



## Links
- [サンプルコード(GitHub)](https://github.com/b1a9id/open-api-sample)




