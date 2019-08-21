---
template: post
title: '@DataJpaTestでRepositoryのテスト'
slug: /posts/data-jpa-test
draft: false
date: 2019-08-21T02:14:36.394Z
description: >-

  Springのテスト部分のリファレンス読んで忘れないうちにまとめよう精神が働いたので書きます。今回は、@DataJpaTestというレポジトリのテストを書くためのアノテーションを紹介します。



  @DataJpaTestアノテーションは、デフォルトでインメモリDBの設定をしたり、@EntityがついたクラスをBean登録したり、@RepositoryついたクラスをBean登録するなどSpring
  Data JPAレポジトリの設定してくれたりします。@DataJpaTestのソースコードをのぞいてみるとこんな感じの設定が行われているようです。
category: Test
tags:
  - SpringBoot
---
テスト書いてますか？私は好きです！嫌いな人は多いみたいですけど...

Springのテスト部分のリファレンス読んで忘れないうちにまとめよう精神が働いたので書きます。
今回は、@DataJpaTestというレポジトリのテストを書くためのアノテーションを紹介します。

@DataJpaTestアノテーションは、デフォルトでインメモリDBの設定をしたり、@EntityがついたクラスをBean登録したり、@RepositoryついたクラスをBean登録するなどSpring Data JPAレポジトリの設定してくれたりします。
@DataJpaTestのソースコードをのぞいてみるとこんな感じの設定が行われているようです。
```
...
@AutoConfigureDataJpa
@AutoConfigureTestDatabase
@AutoConfigureTestEntityManager
...
```

Data JPAテストは、トランザクショナルで各テストの終わりにロールバックします。
もし、こうしたくない場合は、次のように書いてください。
```
@Transactional(propagation = Propagation.NOT_SUPPORTED)
```

また、data JPAテストでは、標準的なJPA EntityManagerの代わりに[TestEntityManager](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/TestEntityManager.html)のBeanがインジェクトされます。

## ソースコード
[GitHub](https://github.com/b1a9id/spring-boot2-sandbox/tree/hotfix/spring-test)

### pom.xml
```
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
	<groupId>com.h2database</groupId>
	<artifactId>h2</artifactId>
	<scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-test</artifactId>
	<scope>test</scope>
	<exclusions>
	    <exclusion>
		<groupId>junit</groupId>
		<artifactId>junit</artifactId>
	    </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>org.junit.platform</groupId>
	<artifactId>junit-platform-launcher</artifactId>
	<version>1.2.0</version>
	<scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
	<artifactId>junit-jupiter-engine</artifactId>
	<version>5.2.0</version>
	<scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.junit.jupiter</groupId>
	<artifactId>junit-jupiter-params</artifactId>
	<version>1.2.0</version>
	<scope>test</scope>
    </dependency>
</dependencies>
```

- Java8
- SpringBoot 2.0.3.RELEASE
- H2
- JUnit5

### Brand.java
```
@Entity
public class Brand implements Serializable {
    enum Gender {
        MAN, WOMAN, UNISEX
    }
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    public Brand(String name, Gender gender) {
        this.name = name;
        this.gender = gender;
    }
    ... getter, setter
}
```
id、ブランド名、ブランドの対象性別をもつBrandエンティティで話を進めていきます。

### BrandRepository.java（今回のテスト対象）
```
@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    List<Brand> findByGender(Gender gender);
    Integer countByGender(Gender gender);
}
```
性別でブランドを検索する findByGenderメソッドと性別ごとのブランド数を検索する countByGenderメソッドを準備しました。

### BrandRepositoryTest.java
```
// SpringExtention.classは、Junit 5上でSpring TestContext Frameworkを使えるようにしている
@ExtendWith(SpringExtension.class)
class BrandRepositoryTest {

    @Nested
    @DataJpaTest
    class FindByGender {
        @Autowired
	private TestEntityManager entityManager;
        @Autowired
        private BrandRepository brandRepository;

	@BeforeEach
	void beforeEach() {
            entityManager.persist(new Brand("STOF", Gender.UNISEX));
	    entityManager.persist(new Brand("ETHOSENS", Gender.MAN));
	    entityManager.persist(new Brand("dulcamara", Gender.UNISEX));
	}

	@Test
	void man() {
	    List<Brand> brands = brandRepository.findByGender(Gender.MAN);
	    org.assertj.core.api.Assertions.assertThat(brands)
	        .extracting(Brand::getName, Brand::getGender)
	        .containsExactly(Tuple.tuple("ETHOSENS", Gender.MAN));
        }

	@Test
	void woman() {
            List<Brand> brands = brandRepository.findByGender(Gender.WOMAN);
	    org.assertj.core.api.Assertions.assertThat(brands)
					.hasSize(0);
	}
    }

    @Nested
    @DataJpaTest
    class CountByGender {
        @Autowired
	private TestEntityManager entityManager;

	@Autowired
	private BrandRepository brandRepository;

	@BeforeEach
	void beforeEach() {
	    entityManager.persist(new Brand("STOF", Gender.UNISEX));
	    entityManager.persist(new Brand("ETHOSENS", Gender.MAN));
	    entityManager.persist(new Brand("dulcamara", Gender.UNISEX));
        }

	@Test
	void man() {
	    int count = brandRepository.countByGender(Gender.MAN);
	    Assertions.assertEquals(1, count);
	}

	@Test
	void woman() {
	    int count = brandRepository.countByGender(Gender.WOMAN);
	    Assertions.assertEquals(0, count);
	}
    }
}
```
検証には一部AssertJを使ってます。AssertJについては、[こちら](https://www.slideshare.net/RyosukeUchitate/assertj-82260732)で簡単に触れてます。

## BrandRepositoryTest.java実行する
実行時のログを抜粋して紹介します。
```
...
2018-07-05 00:20:30.440  INFO 5456 --- [           main] o.s.j.d.e.EmbeddedDatabaseFactory        : Starting embedded database: url='jdbc:h2:mem:393e83d1-908e-4fb0-91d2-8becd045235b;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false', username='sa'
...
```

H2データベースを使ってることがわかります。
```
...
Hibernate: drop table brand if exists
Hibernate: drop sequence if exists hibernate_sequence
Hibernate: create sequence hibernate_sequence start with 1 increment by 1
Hibernate: create table brand (id integer not null, gender varchar(255), name varchar(255) not null, primary key (id))
...
```

brandテーブルを作ってます。
```
...
Hibernate: insert into brand (gender, name, id) values (?, ?, ?)
Hibernate: insert into brand (gender, name, id) values (?, ?, ?)
Hibernate: insert into brand (gender, name, id) values (?, ?, ?)
...
```

beforeEachの処理が行われている様子です。
```
...
Hibernate: select count(brand0_.id) as col_0_0_ from brand brand0_ where brand0_.gender=?
...
Hibernate: select brand0_.id as id1_0_, brand0_.gender as gender2_0_, brand0_.name as name3_0_ from brand brand0_ where brand0_.gender=?
...
```

countByGenderとfindByGenderが実行されていることがわかります。
```
...
Hibernate: drop table brand if exists
Hibernate: drop sequence if exists hibernate_sequenceててsーブルとhibernate_sequenceが削除されていることがわかります。
```

テストが終わるとテーブルとhibernate_sequenceを削除しています。
簡単にレポジトリのテストができることがわかっていただけたかと思います。

hibernate_sequenceは最後にしか消されないので、ずっと連番が振られる続けるので、自動採番のIDの値の検証する場合はお気をつけてください。テストごとに初期データをinsertするの美しくないのでうまい方法見つけたいです。

## 参考
[43.3.11 Auto-configured Data JPA Tests](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-testing.html#boot-features-testing-spring-boot-applications-testing-autoconfigured-jpa-test)

## 追記
2018/7/12
create tableやdrop tableをFlywayを使って行なっているため、application.propertiesに以下のように書いているとテーブルが作成されずに「xxxテーブルがありません」みたいに怒られますので、Flywayは使えるようにしてください。
```
spring.flyway.enabled=false
```
