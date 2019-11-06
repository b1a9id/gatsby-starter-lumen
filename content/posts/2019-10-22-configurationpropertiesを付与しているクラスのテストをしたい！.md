---
template: post
title: ユニットテストで@ConfigurationPropertiesが有効になるようにしたい！
slug: /posts/configuration-properties-test
draft: false
date: 2019-11-06T16:03:00.000Z
description: >-
  `@SpringBootTest`
  を使ってテスト書けば設定ファイルを読み込んでくれるので悩む必要はないんですけど、大人の事情でそういうことができない場合もありますよね。そうすると当然、設定ファイルを読み込んでくれないわけです。

  今回、`@SpringBootTest` を使ってテストを書かなくても設定ファイルを読み込めるようなテストを書きました。
category: Test
tags:
  - SpringBoot
---
ここ数年で何回かぶち当たってたことが解決したので備忘録として。内容はタイトルの通りです。
`@SpringBootTest` を使ってテスト書けば設定ファイルを読み込んでくれるので悩む必要はないんですけど、大人の事情でそういうことができない場合もありますよね。そうすると当然、設定ファイルを読み込んでくれないわけです。

今回、`@SpringBootTest` を使ってテストを書かなくても設定ファイルを読み込めるようなテストを書きました。  

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
  - `@ConfigurationProperties` が付与されたクラスに設定ファイルの値をセットする

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
  - `initializers = ConfigFileApplicationContextInitializer.class` は、設定ファイルを読み込んでくれます。[公式リファレンス](https://docs.spring.io/spring-boot/docs/2.2.0.RELEASE/reference/html/spring-boot-features.html#boot-features-configfileapplicationcontextinitializer-test-utility)  

## おまけ（メソッドに `@ConfigurationProperties` を付与している場合）
app.properties
```
app.app.name=uchitate
```

AppAppProperties.java
```
public class AppAppProperties {
	private String name;

	// getterとsetterは省略
}
```

AppAppConfig.java
```
@Configuration
public class AppAppConfig {

	@Bean
	@ConfigurationProperties("app.app")
	public AppAppProperties appAppProperties() {
		return new AppAppProperties();
	}
}
```

TestConfig.java
```
@TestConfiguration
@Import(AppAppConfig.class)
@EnableConfigurationProperties
public class TestConfig {}
```
- `@Import` でConfigクラスをBean登録する

ConfigurationPropertiesTest.java
```
@ExtendWith(SpringExtension.class)
@TestPropertySource(properties = "spring.config.name=app")
@ContextConfiguration(classes = {TestConfig.class}, initializers = ConfigFileApplicationContextInitializer.class)
class ConfigurationPropertyTest {

	@Autowired
	private AppAppProperties appAppProperties;

	@Test
	void getValue() {
		assertEquals("uchitate", appAppProperties.getName());
	}
}
```

テストクラスは、AppProperties.javaのテストとほぼ同じです


今回の環境
```
Java11
Spring Boot 2.2.RELEASE
```

今回のソースコードは[こちら](https://github.com/b1a9id/spring-boot2-sandbox/tree/hotfix/test-configuration-properties)
