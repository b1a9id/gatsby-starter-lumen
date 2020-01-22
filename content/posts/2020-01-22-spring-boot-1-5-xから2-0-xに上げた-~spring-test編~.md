---
template: post
title: Spring Boot 1.5.xから2.0.xに上げた ~Spring Test編~
slug: /posts/versionup-spring-boot-test-1-to-2
draft: false
date: 2020-01-22T01:33:00.000Z
description: |-
  Spring Boot 2系にあげたときにやったことをまとめようと思います。関連記事
  今回は、Testingの話です。Spring Boot 2.0.9.RELEASEに上げた話になります。2.2対応はまたいつか書きます。
category: Upgrade
tags:
  - SpringBoot
---
Spring Boot 2系にあげたときにやったことをまとめようと思います。[関連記事](https://note.com/b1a9idps/n/n0b9ca2ee57a2)  
今回は、Testingの話です。Spring Boot 2.0.9.RELEASEに上げた話になります。2.2対応はまたいつか書きます。

# 依存しているライブラリのバージョン
Spring Bootのバージョンを`1.5.22`から`2.0.9`に上げると依存しているライブラリのバージョンが次のようになります。  
[Spring Boot 1.5.22.RELEASE](https://docs.spring.io/spring-boot/docs/1.5.22.RELEASE/reference/html/appendix-dependency-versions.html#appendix-dependency-versions)  
↓  
[Spring Boot 2.0.9.RELEASE](https://docs.spring.io/spring-boot/docs/2.0.9.RELEASE/reference/html/appendix-dependency-versions.html#appendix-dependency-versions)  

Spring Boot 2.xに上げると、Mockito 2.xになります。  
JUnit 5も対応しましたが、対応しただけでデフォルトはJUnit 4になっていますのでご注意ください。Spring Booot 2.2.xからデフォルトがJUnit 5になります。

# パッケージ変更
```
- import org.mockito.runners.MockitoJUnitRunner;
+ import org.mockito.junit.MockitoJUnitRunner;
```

```
- import org.mockito.Matchers.*
+ import org.mockito.ArgumentMatchers.*
```

```
- org.mockito.Matchers.anyListOf.(Hoge.class);
+ org.mockito.ArgumentMatchers.anyList();
```
など

# 不要なスタブの削除
利用していないスタブがある場合は、UnnecessaryStubbingExceptionを投げるようになりました。
行番号を教えてくれるのでひたすら削除します。

例えば、このようなテストを書いていたとします。
```
String result - translator.translate("one");

// test
when(translator.translate("one")).thenReturn("jeden");
when(translator.translate("two")).thenReturn("dwa");
```

`when(translator.translate("two")).thenReturn("dwa");`のスタブは作ったけど、実際呼ばれることがないのでUnnecessaryStubbingExceptionが投げられます。
歴史のあるコードだと消し忘れはいっぱいあると思うので地味に辛いですね...

# まとめ
Spring Boot 2.0.xへのテストのマイグレーションは特に難しくはなかったですけど、単なる書き換えが多くて眠かったです。2.1.x, 2.2.xの変更の方が大変です。
ちなみにJUnit 5からHamcrestがデフォルトで入らなくなりましたのでこれを機に[AssertJ](https://assertj.github.io/doc/)に移行してみてはいかかでしょうか？
