---
template: post
title: SpringBoot1系から2系に移行した
slug: /posts/migrate-from-boot1-to-boot2/
draft: true
date: '2018-12-14T12:23:32.169Z'
description: >-
  Spring Boot2系に移行してハマった点について書きます。ほぼ備忘録です。ついでなので2.0.x -> 2.1.xで変更された点もまとめます。
  変更点見つけたら随時書いていこうと思います。 移行前のSpring
  Bootのバージョンは1.5.10です。2系のバージョンは、2.1.1（2018/12/14時点の最新）です。
category: Spring Boot
tags:
  - Spring Boot
---

Spring Boot2系に移行してハマった点について書きます。ほぼ備忘録です。変更点見つけたら随時書いていこうと思います。
移行前のSpring Bootのバージョンは<b>1.5.10</b>です。2系のバージョンは、<b>2.1.1（2018/12/14時点の最新）</b>です。

# Web
## ErrorAttributes#getErrorAttributes()の引数変わった
[https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/web/servlet/error/ErrorAttributes.java](https://github.com/spring-projects/spring-boot/blob/master/spring-boot-project/spring-boot/src/main/java/org/springframework/boot/web/servlet/error/ErrorAttributes.java)

# Gradle
## 実行可能jarの作り方
### 1
bootRepackageタスクが呼ばれたあとにjarタスクが呼ばれて実行可能jarが作られるようです。
```
bootRepackage {
    executable = true
}
```

### 2
bootJarタスクで実行可能jarを作ります。jarタスクは無効になっているようです。
[https://docs.spring.io/spring-boot/docs/2.1.7.RELEASE/gradle-plugin/reference/html/#packaging-executable-and-normal](https://docs.spring.io/spring-boot/docs/2.1.7.RELEASE/gradle-plugin/reference/html/#packaging-executable-and-normal)
```
bootJar {
    launchScript()
}
```

## バージョンアップ
2系では、Gradle 4.x以上がマストです。
```groovy
wrapper {
    gradleVersion = "4.10.2"
    distributionType = Wrapper.DistributionType.ALL
}
```

コマンドを実行  
`./gradlew wrapper`

- [Upgrading your build from Gradle 4.x to 5.0](https://docs.gradle.org/5.0/userguide/upgrading_version_4.html) を参考にやってく

- Gradle 4.7からcompileとかruntimeなどが非推奨になってる
[参考](https://docs.gradle.org/4.7/userguide/java_plugin.html#sec:java_plugin_and_dependency_management)

## jarの名前を変更する
`jar.baseName='hoge'` ->  bootJarタスク内で `archivesBaseName='hoge'`

- [Jar](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.bundling.Jar.html)

# actuator
## エンドポイントプレフィックス
### 1
`/health`

### 2
<b>/actuator</b>がつくようになりました。
[https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/html/production-ready-endpoints.html](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/html/production-ready-endpoints.html)

`/actuator/health`

# logging
## logback-spring.xmlのProfile指定方法
### 1 ~ 2.0.x「,」区切りでした。
```
<springProfile name="dev, staging">
    <!-- configuration to be enabled when the "dev" or "staging" profiles are active -->
</springProfile>
```
### 2.1.x「|」区切りになりました。
[https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/html/boot-features-logging.html#_profile_specific_configuration]([https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/reference/html/boot-features-logging.html#_profile_specific_configuration)
```
<springProfile name="dev | staging">
    <!-- configuration to be enabled when the "dev" or "staging" profiles are active -->
</springProfile>
```

# Lombok
## Gradle 4.9でlombok.javac.apt.LombokProcessor could not be initialized
Lombokのバージョンを `1.18.2` にする。 [参考](https://stlisacity.hatenablog.com/entry/2018/08/27/123258)

## Gradle 5.0からはアノテーションプロセッサをコンパイル時のクラスパスから取得する方法がサポートされない

# Test
## MockitoJUnitRunnerのパッケージ変更
`org.mockito.runners.MockitoJUnitRunner` -> `org.mockito.junit.MockitoJUnitRunner`




