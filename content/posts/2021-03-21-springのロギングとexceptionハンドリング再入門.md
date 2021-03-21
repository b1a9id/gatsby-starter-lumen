---
template: post
title: SpringのロギングとExceptionハンドリング再入門
slug: /posts/spring-logging
draft: false
date: 2021-03-21T13:04:58.936Z
description: Spring
  MVCのロギング、Exceptionハンドリングについての再入門。ロギングについては、「ログのファイル出力」、「Logbackを使ったログ出力」について。Exceptionハンドリングについては、「HandlerExceptionResolverと呼び出される順序」について。
category: Logging
tags:
  - Java
  - Spring
---
同僚氏のPRレビューをするにあたって、ロギング、Exceptionハンドリングよくわかってないなって思って再入門してみた。
「@ExceptionHandlerのメソッドでハンドリングしたときのレスポンスをログ出力する」というのがPRの内容だった。

「1.どこでアクセス（リクエスト）ログを出力するのがよいのか」、「2.どうやってExceptionハンドリングが行われているのか」について調べたことをまとめる。

**※本記事の環境はJava 11, Spring Boot 2.4.4**

## ロギング
[公式ドキュメント](https://docs.spring.io/spring-boot/docs/2.4.4/reference/html/spring-boot-features.html#boot-features-logging)

Spring Bootは、[Commons Logging](https://commons.apache.org/proper/commons-logging/)を使ってログ出力をしている。デフォルト設定としては、[Java Util Logging]()、[Log4j2](https://logging.apache.org/log4j/2.x/)、[Logback](https://logback.qos.ch/)を提供している。

spring-boot-starter-loggingを依存関係に追加している場合は、Logbackが使われる。
[spring-boot-starter-logging](https://github.com/spring-projects/spring-boot/blob/2.4.x/spring-boot-project/spring-boot-starters/spring-boot-starter-logging/build.gradle)には、Logback、Log4j、Slf4jが依存関係に追加されている。

### ログのファイル出力
Spring Bootは、デフォルトでコンソールのみにだけログを出力してファイルには出力しない。ファイルに出力したい場合は、application.properties(yml)に`logging.file.path`でパスを指定するだけでよい。デフォルトのファイル名はspring.logなので、変更したい場合は`logging.file.name`でファイル名を指定する。

### Logbackを使ったログ出力
[howto-loggin](https://docs.spring.io/spring-boot/docs/2.4.4/reference/html/howto.html#howto-logging)をそのままマネするだけで、Logbackを使ってログ出力が可能。

このように書けば、ファイルとコンソールにログを出力できる。

`gist:b1a9id/253f7cd05981e716c4e56cd680f108a4?file=logback-spring.xml`　

### ログレベルで出力するファイルを分ける
logback-spring.xmlでfilter要素を指定すれば、出力ログのフィルタリングができる。

`gist:b1a9id/22863b7466d05c5516563ec3251df0e0?file=logback-spring.xml`

- appender name="FILE_INFO"
  - ログレベルINFOのログを${LOG_PATH}/application.logに出力
- appender name="FILE_ERROR"
  - ログレベルERRORのログを${LOG_PATH}/error.logに出力

### アクセスログの出力
Spring MVCで用意されている[CommonsRequestLoggingFilter.java](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/filter/CommonsRequestLoggingFilter.java)を使ってアクセスログを出力してみる。

まず、CommonsRequestLoggingFilter.javaをBean登録する。

`gist:b1a9id/6aa0510c342752d8aa9fa37f3cd7f33c?file=RequestLoggingFilterConfig.java`

次に、application.ymlでログレベルDEBUGのログを出力するように設定する。

`gist:b1a9id/808b627dd1c037b61abb9a82c5e838ba?file=application.yml`

[サンプルのREST API](https://github.com/b1a9id/logging-sample/blob/main/src/main/java/com/b1a9idps/loggingsample/controller/SampleController.java)に対してリクエストを送ると、このような感じでログ出力される。

```sh
2021-03-21 21:17:10.364 DEBUG 24133 --- [nio-8080-exec-2] o.s.w.f.CommonsRequestLoggingFilter      : Before request [GET /users]
2021-03-21 21:17:10.396 DEBUG 24133 --- [nio-8080-exec-2] o.s.w.f.CommonsRequestLoggingFilter      : Request data : GET /users]
2021-03-21 21:17:14.724 DEBUG 24133 --- [nio-8080-exec-3] o.s.w.f.CommonsRequestLoggingFilter      : Before request [GET /users/1]
2021-03-21 21:17:14.735 DEBUG 24133 --- [nio-8080-exec-3] o.s.w.f.CommonsRequestLoggingFilter      : Request data : GET /users/1]
2021-03-21 21:17:17.829 DEBUG 24133 --- [nio-8080-exec-4] o.s.w.f.CommonsRequestLoggingFilter      : Before request [GET /users/5]
2021-03-21 21:17:17.837 DEBUG 24133 --- [nio-8080-exec-4] o.s.w.f.CommonsRequestLoggingFilter      : Request data : GET /users/5]
2021-03-21 21:17:31.881 DEBUG 24133 --- [nio-8080-exec-5] o.s.w.f.CommonsRequestLoggingFilter      : Before request [POST /users]
2021-03-21 21:17:31.904 DEBUG 24133 --- [nio-8080-exec-5] o.s.w.f.CommonsRequestLoggingFilter      : Request data : POST /users, payload={
    "name": "test"
}]
```

単にリクエスト情報を知りたい場合は、用意されているクラスを使えば簡単にできる。

---

ここで、冒頭の「どこでアクセス（リクエスト）ログを出力するのがよいのか」について考えてみる。
先ほど利用した、CommonsRequestLoggingFilter.javaは、[AbstractRequestLoggingFilter.java](https://github.com/spring-projects/spring-framework/blob/master/spring-web/src/main/java/org/springframework/web/filter/AbstractRequestLoggingFilter.java)を継承しておりこのクラスは、OncePerRequestFilter.javaを継承している。

これを踏まえると、`OncePerRequestFilter.java`を継承してアクセスログを出力するのが正しいそう。


## Exceptionハンドリング
Spring MVCで、Controller以降の処理で発生した例外をハンドリングするコンポーネントとして、[org.springframework.web.servlet.HandlerExceptionResolver](https://github.com/spring-projects/spring-framework/blob/master/spring-webmvc/src/main/java/org/springframework/web/servlet/HandlerExceptionResolver.java)インターフェースといくつかの実装クラスを提供している。

デフォルトで適用されるHandlerExceptionResolverの実装クラスと呼び出される順序は、「1.ExceptionHandlerExceptionResolver.java」、「2.ResponseStatusExceptionResolver.java」、「3.DefaultHandlerExceptionResolver.java」である。

- ExceptionHandlerExceptionResolver.java
  - `@ExceptionHandler`を指定したメソッドのためのExceptionハンドラ
- ResponseStatusExceptionResolver.java
  - `@ResponseStatus`を付与した例外クラスのためのExceptionハンドラ
- DefaultHandlerExceptionResolver.java
  - Spring MVCのコントローラの処理で発生する例外をハンドリングするためのExceptionハンドラ


## Links
- [サンプルアプリケーション](https://github.com/b1a9id/logging-sample)