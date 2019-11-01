---
template: post
title: ユニットテストで@ConfigurationPropertiesが有効になるようにしたい！
slug: /posts/configuration-properties-test
draft: true
date: 2019-10-21T20:10:08.677Z
description: ユニットテストで@ConfigurationPropertiesが有効になるようにしたい！
category: Test
tags:
  - SpringBoot
---
ユニットテストで設定ファイル読み込んでくれないのなんでだろうから全てははじまりました。
`@SpringBootTest` を使ってテストすれば設定ファイルを読み込んでくれるので悩む必要はないんですけど、大人の事情で `@InjectMocks` を使ってテストの対象のクラスをインスタンス化して...というテストを書くこともあるかと思います。そうすると当然、設定ファイルを読み込んでくれないわけです。  

今回、次のようなテストを書きました。  

app.properties
```
app.domain=b1a9idps.com
```

AppProperties.java
```
@ConfigurationProperties("app")
public class AppProperties {
	private String domain;

	// getterとsetterは省略
}
```

TestConfig.java  
```
@TestConfiguration
@EnableConfigurationProperties(value = AppProperties.class)
public class TestConfig {}
```

- `@EnableConfigurationProperties` 
  - 指定した `@ConfigurationProperties` が付与されたクラスをBean登録してくれます。

ConfigurationPropertyTest.java  
```
@ExtendWith(SpringExtension.class)
@TestPropertySource(properties = "spring.config.name=app")
@ContextConfiguration(classes = {TestConfig.class}, initializers = ConfigFileApplicationContextInitializer.class)
class ConfigurationPropertyTest {

	@Autowired
	private AppProperties appProperties;

	@Test
	void getValue() {
		assertEquals("b1a9idps.com", appProperties.getDomain());
	}
}
```
- `@ContextConfiguration(classes = {TestConfig.class}, initializers = ConfigFileApplicationContextInitializer.class)`
  - `classes = {TestConfig.class}` は、TestConfigクラスを適用します。
  - `initializers = ConfigFileApplicationContextInitializer.class` は、設定ファイルを読み込んでくれます。


