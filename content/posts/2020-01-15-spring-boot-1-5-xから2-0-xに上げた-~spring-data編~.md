---
template: post
title: Spring Boot 1.5.xから2.0.xに上げた ~Spring Data編~
slug: /posts/versionup-spring-boot-data-1-to-2
draft: false
date: 2020-01-14T15:52:52.425Z
description: >-
  Spring Boot
  2系にあげたときにやったことをまとめようと思います。[関連記事](https://note.com/b1a9idps/n/n0b9ca2ee57a2)今回は、Spring
  Data JPAの話です。Spring Boot 2.0.9.RELEASEに上げた話になります。2.2対応はまたいつか書きます。
category: Upgrade
tags:
  - SpringBoot
---
Spring Boot 2系にあげたときにやったことをまとめようと思います。[関連記事](https://note.com/b1a9idps/n/n0b9ca2ee57a2)  
今回は、Spring Data JPAの話です。Spring Boot 2.0.9.RELEASEに上げた話になります。2.2対応はまたいつか書きます。

# 依存しているライブラリのバージョン
Spring Bootのバージョンを`1.5.22`から`2.0.9`に上げると依存しているライブラリのバージョンが次のようになります。  
[Spring Boot 1.5.22.RELEASE](https://docs.spring.io/spring-boot/docs/1.5.22.RELEASE/reference/html/appendix-dependency-versions.html#appendix-dependency-versions)  
↓  
[Spring Boot 2.0.9.RELEASE](https://docs.spring.io/spring-boot/docs/2.0.9.RELEASE/reference/html/appendix-dependency-versions.html#appendix-dependency-versions)  

# DataSource
## コネクションプールの変更
デフォルトのコネクションプールがTomcatからHikariCPになった。  

## カスタマイズしたDataSourceを利用する際はプロパティに気をつける
コネクションプールにHikariCPを利用してDataSourceをカスタマイズする際、`url`でなく、`jdbc-url`にする。[参考](https://docs.spring.io/spring-boot/docs/2.0.9.RELEASE/reference/html/howto-data-access.html#howto-configure-a-datasource)  
application.properties
```
app.datasource.jdbc-url=jdbc:mysql://localhost/test
app.datasource.username=dbuser
app.datasource.password=dbpass
app.datasource.maximum-pool-size=30
```

```
@Bean
@ConfigurationProperties("app.datasource")
public HikariDataSource dataSource() {
	return DataSourceBuilder.create().type(HikariDataSource.class).build();
}
```

## X-RayでSQLトレースする際はHikariCPは使えない
X-Rayを使ってSQLクエリをトレースする際、`org.apache.tomcat.jdbc.pool.JdbcInterceptor`を実装したインターセプタを利用するため、HikariCPを依存関係から除外して、tomcat-jdbcを追加しなければなりません。[参考](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-sdk-java-sqlclients.html)  

build.gradle　　
```
dependencies {
  implementation("org.springframework.boot:spring-boot-starter-data-jpa") {
          exclude group: 'com.zaxxer'
  }
  implementation "org.apache.tomcat:tomcat-jdbc"
}
```

pom.xml
```
<dependencies>
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-jdbc</artifactId>
      <exclusions>
          <exclusion>
              <groupId>com.zaxxer</groupId>
              <artifactId>HikariCP</artifactId>
          </exclusion>
      </exclusions>
  </dependency>    
  <dependency>
      <groupId>org.apache.tomcat</groupId>
      <artifactId>tomcat-jdbc</artifactId>
  </dependency>
</dependencies>
```

# Spring Data
## PageRequest.java, Sort.javaのコンストラクタが非推奨になった
コンストラクタが非推奨になって、staticコンストラクタを使用するようになった。  
```
- new PageRequest(1, 10);
+ PageRequest.of(1, 10);
```

```
- new Sort(orders);
+ Sort.by(orders);
```

# Spring Data JPA
## JpaRepository.javaが結構変わった
### メソッドの戻り値にOptionalを使えるようになった
```
- User findByName(String name);
+ Optional<User> findByName(String name);
```

### メソッド名が変わった
```
- <S extends T> List<S> save(Iterable<S> entities);
+ <S extends T> List<S> saveAll(Iterable<S> entities);
```
などなど
