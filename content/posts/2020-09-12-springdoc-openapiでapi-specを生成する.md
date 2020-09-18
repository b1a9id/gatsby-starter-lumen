---
template: post
title: springdoc-openapiでOpenAPI形式のAPIドキュメントを生成する
slug: /posts/springdoc-openapi-1
draft: false
date: 2020-09-13T16:05:02.531Z
description: >-
  springdoc-openapiは、Spring
  Bootを利用しているプロジェクトで簡単にOpenAPI形式のAPIドキュメントを生成してくれるライブラリです。  

  Web MVC, WebFluxともに対応しているようです。  

  [サンプルコード(GitHub)](https://github.com/b1a9id/open-api-sample)
category: Document
tags:
  - SpringDocOpenApi
---
こんにちは！
みなさん、API Spec書いてますか？私はお仕事で、OpenAPI(Swagger)形式のYAMLを書いています！

ソースコードとドキュメントを別にしてしまうと、実装途中で仕様変更になったときにyml書き直すのが手間だったり、APIの実装と合ってない箇所があったりなどの問題が発生してしまいます。（そもそもyml書くの辛いし）  

プロダクションコードに手を加えることなくプロダクションコードをベースにOpenAPI形式のAPIドキュメントを吐き出すライブラリを探していました。  
いくつかそれっぽいライブラリはあるのですが、プロダクトションコードに設定書かないといけなかったり、テストに設定書かないといけないし（テストコードが全部あるわけじゃない）で要望を完全に満たしてもらえませんでした...  
最近、完全に要望を満たしてくれる [springdoc-openapi](https://springdoc.org) というライブラリを見つけましたので紹介します！！！！！

## springdoc-openapiとは

springdoc-openapiは、Spring Bootを利用しているプロジェクトで簡単にOpenAPI形式のAPIドキュメントを生成してくれるライブラリです。  
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

今回は、Web MVCでのサンプルを紹介します。

### API

SakeController.java\
`gist:b1a9id/38f4874fa75ca687708381af4590603b?file=SakeController.java`  

SakeResponse.java\
`gist:b1a9id/14bbd9ec81351e8a2fe3a2eb272b7fa6?file=SakeResponse.java`

SakeCreateRequest.java\
`gist:b1a9id/4ad49e44b2105f4baaab65a15f6d12ab?file=SakeCreateRequest.java`  

GlobalControllerHandler.java\
`gist:b1a9id/057714c7615793291409cd76cd9a4f25?file=GlobalControllerHandler.java`  

ただのController周りの実装なので、説明は省略します。

### springdoc-openapiの導入

build.gradle\
`gist:b1a9id/70a6fbaf6b8eeacf2bca830b820dcd62?file=build.gradle`  

この１行追加します。

### アプリケーションの起動

アプリケーションを起動して、デフォルトで用意されているURLにアクセスすると、それぞれjson, yaml, htmlを返してくれすます。

`GET http://localhost:8080/v3/api-docs/`
`gist:b1a9id/abbe13192f4e0ab00ac44511a87c19a2?file=openapi.json`  

`GET http://localhost:8080/v3/api-docs.yaml`\
`gist:b1a9id/0ac72e5e23a343ed642a53c4e2bdbcd1?file=openapi.yaml`  

`GET http://localhost:8080/swagger-ui.html(GET http://localhost:8080/swagger-ui/index.html)`  

![open-api.html](/media/openapi-html.png)

これだけで、APIドキュメントが生成されるなんて感動しませんか？\
Controllerクラスや`@RestControllerAdvice`が付与されているクラスの`@ExceptionHandler`を読み取ってレスポンスに適用してくれます。  

`@NotNull`、 `@NotBlank`、 `@Size`、 `@Min`、 `@Max` のような、JSR-303 Bean Validationのアノテーションについても適用してくれます。

![validation](/media/スクリーンショット-2020-09-14-0.51.23.png)

### カスタマイズ

`application.properties` に書けば、デフォルト設定を変更できます。設定値一覧は、[springdoc-properties](https://springdoc.org/springdoc-properties.html)を参考にしてください。

設定値の抜粋です。値はデフォルト値です。

```
- JSONのOpenAPIドキュメントのパス
  - springdoc.api-docs.path=/v3/api-docs
- OpenAPIエンドポイントの有効・無効
  - springdoc.api-docs.enabled=true
- `@ControllerAdvice` が付与されたクラスに書かれたレスポンスを全レスポンスに適用するかどうか
  - springdoc.override-with-generic-response=true
- Swagger UIが適用されたHTMLドキュメント表示するパス
  - springdoc.swagger-ui.path=/swagger-ui.html
```

## Links
- [サンプルコード(GitHub)](https://github.com/b1a9id/open-api-sample)

## まとめ
特に設定なしにAPIドキュメントを生成してくるのはとてもよいですね。
気になったところは、タグがController名のケバブケースになってしまうところですが、 `@Tag(name="sake")` をControllerに付与してあげれば変更は可能でした。
springdoc-openapiでフロント、モバイルチームとのコミュニケーションが円滑に進みそうです！
