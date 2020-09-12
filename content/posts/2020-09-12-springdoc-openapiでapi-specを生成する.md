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
みなさん、API Spec書いてますか？私が所属するコイニーのバックエンドチームではOpenAPI(Swagger)を使って書いています！

フロントエンドチームやモバイルチームと次のフローでコミュニケーションを取っています。
```
1. バックエンドチームがAPI Spec(yml)を書く
2. フロント、モバイルチームにレビューしてもらう
3. 承認されたらAPIの実装
```

しかし、このフローだと、実装途中で仕様変更になったときにyml書き直すのが手間だったりAPIの実装と合ってない箇所があったりなどの問題があります。  
そもそもyml書くの辛いし..  

プロダクションコードに手を加えることなくプロダクションコードをベースにAPI Specを吐き出すライブラリを探していました。  
Spring foxは、プロダクトションコードをがっつり触らないといけないし、Spring REST Docsはテストに設定書かないといけないし（テストコードが全部あるわけじゃない）でした...  
最近、完全に要望を満たしてくれる [springdoc-openapi](https://springdoc.org) というライブラリを見つけましたので紹介します！！！！！


