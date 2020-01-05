---
template: post
title: Spring Boot 1.5.xから2.0.xに上げた ~Spring Web編~
slug: /posts/versionup-spring-boot-web-1-to-2
draft: false
date: 2020-01-05T06:37:07.410Z
description: >-
  Spring Boot
  2系にあげたときにやったことをまとめようと思います。（[関連記事](https://note.com/b1a9idps/n/n0b9ca2ee57a2)） 
  今回は、Spring Webの話です。Spring Boot 2.0.9.RELEASEに上げた話になります。2.2対応はまたいつか書きます。
category: Upgrade
tags:
  - SpringBoot
---
Spring Boot 2系にあげたときにやったことをまとめようと思います。（[関連記事](https://note.com/b1a9idps/n/n0b9ca2ee57a2)）  
今回は、Spring Webの話です。Spring Boot 2.0.9.RELEASEに上げた話になります。2.2対応はまたいつか書きます。

# 依存しているライブラリのバージョン
Spring Bootのバージョンを`1.5.22`から`2.0.9`に上げると依存しているライブラリのバージョンが次のようになります。  
[Spring Boot 1.5.22.RELEASE](https://docs.spring.io/spring-boot/docs/1.5.22.RELEASE/reference/html/appendix-dependency-versions.html#appendix-dependency-versions)  
↓  
[Spring Boot 2.0.9.RELEASE](https://docs.spring.io/spring-boot/docs/2.0.9.RELEASE/reference/html/appendix-dependency-versions.html#appendix-dependency-versions)  

# Hibernate Validator
## `@NotBlank`, `@NotBlank`, `@Email`が非推奨になった
Hibernate Validator 6.0.0.Finalから`org.hibernate.validator.constraints.NotBlank`, `org.hibernate.validator.constraints.NotEmpty`, `org.hibernate.validator.constraints.Email`が非推奨になりました。[参考](https://developer.jboss.org/wiki/HibernateValidatorMigrationGuide#jive_content_id_600Final)  
Spring Boot 2系からはjavax-validationが提供するアノテーションを利用します。
```
- org.hibernate.validator.constraints.NotBlank
+ javax.validation.constraints.NotBlank
```

# Jackson /JSON Support
Spring Boot 2から`spring-boot-starter-json`が作られました。  
`jackson-databind`, `jackson-datatype-jdk8`, `jackson-datatype-jsr310`, `jackson-module-parameter-names`が含まれていますので、これらを`spring-boot-starter-json`に置き換えることができます。[参考](https://github.com/spring-projects/spring-boot/blob/v2.0.0.RELEASE/spring-boot-project/spring-boot-starters/spring-boot-starter-json/pom.xml)

# Spring Web
## WebMvcConfigurerAdapter.classが非推奨
Spring Boot 2（Spring 5）からWebMvcConfigurerAdapter.classが非推奨となり、先のクラスを拡張するのではなく、WebMvcConfigurer.classを実装するようになりました。  
Spring 5からJava8+になってdefaultメソッドが使えるようになり、WebMvcConfigurerAdapter.classを使わずともインターフェースに実装できるようになったからです。[Javadoc](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/servlet/config/annotation/WebMvcConfigurerAdapter.html)  

## パッケージ変更
Spring Boot 2（Spring 5）からWebと言ってもServletとReactiveに分かれたためです。  
```
- org.springframework.boot.autoconfigure.web.ErrorAttributes
+ org.springframework.boot.web.servlet.error.ErrorAttributes
```

```
- org.springframework.boot.autoconfigure.web.ErrorController
+ org.springframework.boot.web.servlet.error.ErrorController
```

## プロパティ変更
[Boot 2.0.9.RELEASEの設定値一覧](https://docs.spring.io/spring-boot/docs/2.0.9.RELEASE/reference/htmlsingle/#appendix)を見れば書いてあります。  

```
- server.context-path
+ server.servlet.context-path
```

# おまけ
## org.springframework.web.util.HtmlUtils.htmlEscape(String input, String encoding)の実装が変わった
見出しの通りです。[4.3.x.RELEASE](https://github.com/spring-projects/spring-framework/blob/4.3.x/spring-web/src/main/java/org/springframework/web/util/HtmlUtils.java#L81)から[5.0.x.RELEASE](https://github.com/spring-projects/spring-framework/blob/5.0.x/spring-web/src/main/java/org/springframework/web/util/HtmlUtils.java#L81)に変わりました。  
`4.3.x`では、`input == null`のときnullが返ってきていましたが、`5.0.x`からはExceptionを投げるようになりました。

このように書いていたので本番で障害が起きてしまいました...みなさんお気をつけて  
```
// inputはnullのとき
String result = HtmlUtils.htmlEscape(input, encoding);
if (result == null) {
  何か処理
}
```
