---
template: post
title: '@ConfigurationPropertiesを付与しているクラスのテストをしたい！'
slug: /posts/configuration-properties-test
draft: true
date: 2019-10-21T20:10:08.677Z
description: '@ConfigurationPropertiesを付与しているクラスのテストをしたい！'
category: Test
tags:
  - SpringBoot
---
ユニットテスト書いているときに、設定ファイル読み込んでくれないのなんでだろうから全てははじまりました。
`@SpringBootTest` を使ってテストすれば設定ファイルを読み込んでくれるので悩む必要はないんですけど、大人の事情で `@InjectMocks` を使ってテストの対象のクラスをインスタンス化して...というテストを書くこともあるかと思います。そうすると当然、設定ファイルを読み込んでくれないわけです。

次のようなクラスを実装しました。  
AppProperties.java  
```java
@Component
@ConfigurationProperties("app")
public class AppProperties {
	private String domain;

	// getterとsetterは省略
}
```

application.properties
```
domain=b1a9idps.com
```

そしてこのテストをApplicationContextを作らずにテストを書くと
AppPropertiesTest.java
```java
@ExtendWith(SpringExtension.class)
class AppPropertiesTest {
	@InjectMocks
	private AppProperties appProperties;

	@BeforeEach
	void beforeEach() {
		appProperties.setDomain("b1a9idps.com");
	}

	@Test
	void success() {
		Assertions.assertEquals("b1a9idps.com", appProperties.getDomain());
	}

}
```



