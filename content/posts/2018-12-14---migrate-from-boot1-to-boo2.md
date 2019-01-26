---
template: post
title: SpringBoot1系から2系に移行しててハマった点
slug: /posts/migrate-from-boot1-to-boot2/
draft: false
date: '2018-12-14T12:23:32.169Z'
description: >-
  Spring Boot2系に移行してハマった点について書きます。ほぼ備忘録です。ついでなので2.0.x -> 2.1.xで変更された点もまとめます。
  変更点見つけたら随時書いていこうと思います。 移行前のSpring
  Bootのバージョンは1.5.10です。2系のバージョンは、2.1.1（2018/12/14時点の最新）です。
category: Backend
tags:
  - Spring Boot
---

Spring Boot2系に移行してハマった点について書きます。ほぼ備忘録です。ついでなので2.0.x -> 2.1.xで変更された点もまとめます。
変更点見つけたら随時書いていこうと思います。
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
[https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/gradle-plugin/reference/html/#packaging-executable-and-normal](https://docs.spring.io/spring-boot/docs/2.1.1.RELEASE/gradle-plugin/reference/html/#packaging-executable-and-normal)
```
bootJar {
    launchScript()
}
```

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

