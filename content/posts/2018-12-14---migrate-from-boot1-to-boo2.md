---
template: post
title: SpringBoot1系から2系に移行した
slug: /posts/migrate-from-boot1-to-boot2/
draft: true
date: 2019-09-06T03:35:00.000Z
description: >-
  Spring Boot2系に移行してハマった点について書きます。ほぼ備忘録です。ついでなので2.0.x -> 2.1.xで変更された点もまとめます。
  変更点見つけたら随時書いていこうと思います。 移行前のSpring Bootのバージョンは1.5.10です。
category: Spring Boot
tags:
  - Spring Boot
---

Spring Boot2系に移行してハマった点について書きます。ほぼ備忘録です。変更点見つけたら随時書いていこうと思います。
移行前のSpring Bootのバージョンは<b>1.5.10</b>です。

# 参考にしたドキュメント
- 1.4.x -> 1.5.x
  - [Spring Boot 1.5 Release Notes](https://github.com/spring-projects/spring-boot/wiki/spring-boot-1.5-release-notes)
- 1.5.x -> 2.0.x
  - [Spring Boot 2.0 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Release-Notes)
  - [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)
- Gradle 4.x -> 5.0
  - [Upgrading your build from Gradle 4.x to 5.0](https://docs.gradle.org/5.0/userguide/upgrading_version_4.html)
- RelaxedPropertyResolver is no longer available
  - [Relaxed Binding 2.0](https://github.com/spring-projects/spring-boot/wiki/Relaxed-Binding-2.0)

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

### バージョンアップ
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
- [Gradle 5.0 with Lombok and Spring Boot](https://medium.com/@tsuyoshiushio/gradle-5-0-with-lombok-and-spring-boot-e8ca564fc552)
- [Gradle 5.0 に備えて annotationProcessor について調べる](https://qiita.com/opengl-8080/items/08a9cbe973fad53d93a7)

# Flyway
マイグレーション情報格納テーブルの名前が変更 `schema_version` -> `flyway_schema_history`
- [[Spring Boot] Flyway 3系で作ったテーブルを Flyway 5系にアップデートする方法](https://dev.classmethod.jp/server-side/upgrade-flyway-version-to-5-x/)

# Test
## MockitoJUnitRunnerのパッケージ変更
`org.mockito.runners.MockitoJUnitRunner` -> `org.mockito.junit.MockitoJUnitRunner`


## JUnit 5.4.2から追加する依存関係減った
- [junit5-samples/junit5-jupiter-starter-gradle/build.gradle](https://github.com/junit-team/junit5-samples/blob/r5.4.2/junit5-jupiter-starter-gradle/build.gradle#L12)




