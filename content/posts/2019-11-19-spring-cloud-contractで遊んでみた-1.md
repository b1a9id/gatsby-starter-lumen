---
template: post
title: 'Spring Cloud Contractで遊んでみた #1'
slug: /posts/spring-cloud-contract-1
draft: false
date: 2019-11-18T15:29:59.706Z
description: >-
  Spring Cloud Contractを触ってみようと思ったきっかけは、会社での開発フローに問題を感じているからです。会社での開発フローは、
  `SwaggerでAPI定義書を書く` -> `レビュー` ->
  `実装`です。このフローには「1.実装とAPI定義書で乖離してしまう恐れがある」、「2.いちいちAPI定義書を書くのがめんどくさい」、「3.実装が仕様を満たしている保証はできない」という問題があります。
category: TEST
tags:
  - SpringCloudContract
---
Spring Cloud Contractを触ってみようと思ったきっかけは、会社での `SwaggerでAPI定義書を書く` -> `レビュー` -> `実装` という開発フロー問題を感じているからです。  
このフローには **1.実装とAPI定義書で乖離してしまう恐れがある** 、 **2.いちいちAPI定義書を書くのがめんどくさい** 、 **3.実装が仕様を満たしている保証はできない** という問題があります。

そこで、実装とAPI定義書が乖離しないいい感じのライブラリを探してたら、「Spring Fox」と「Spring REST Docs」が見つかりました。しかし、どちらもコードからAPI定義書を生成してくれるライブラリなのですが、微妙だなと感じました。
Spring Foxは、公式でないしプロダクトコードに手を加えないといけないのは嫌です。Spring REST Docsは理想に近かったのですが、TDD向きで今から始めるには辛いかなと。  
このような相談を知り合いのエンジニアに話したら、Spring Cloud Contractがあるよと教えてくれました。

# Spring Cloud Contractとは
Spring Cloud Contractは、CDC(Consumer Driven Contracts)をサポートするためのプロジェクトでマイクロサービス化されたアプリケーションに嬉しいプロジェクトです。

# Consumer Driven Contracts testingとは
Consumer Driven Contracts(CDC) testingは主にマイクロサービスに役立つテスト手法です。
Consumer（サービスを使う側）が定義したContract（契約）をProvider（サービスを提供する側）が守らなければなりません。

# サンプルアプリケーション
ソースコードはGitHubに置いてあります。  
[Producer](https://github.com/b1a9id/producer)  
[Consumer](https://github.com/b1a9id/consumer)  

## サンプルの内容
- ProducerとConsumerを実装
- Spring Cloud Contractを使ってCDC testingできるようにする

サンプルは、Java13、Spring Boot2.2.0で作っています。

# Producer
## Controllerの実装
BrandController.java
```
@RestController
@RequestMapping("/brands")
public class BrandController {
  @GetMapping
  public BrandListDto list() {
      Brand stof = new Brand();
      stof.setName("STOF");
      stof.setDesigner("Tanita");

      BrandListDto listDto = new BrandListDto();
      listDto.setBrands(List.of(stof));
      return listDto;
  }
}
```

## Spring Cloud Contractを依存関係に追加
pom.xml
```
<dependencies>
  <dependency>
  	<groupId>org.springframework.cloud</groupId>
  	<artifactId>spring-cloud-starter-contract-verifier</artifactId>
  	<scope>test</scope>
  </dependency>
</dependencies>

<dependencyManagement>
  <dependencies>
  	<dependency>
  		<groupId>org.springframework.cloud</groupId>
  		<artifactId>spring-cloud-dependencies</artifactId>
  		<version>${spring-cloud.version}</version>
  		<type>pom</type>
  		<scope>import</scope>
  	</dependency>
  </dependencies>
</dependencyManagement>

<build>
  <plugins>
  	<plugin>
  		<groupId>org.springframework.cloud</groupId>
  		<artifactId>spring-cloud-contract-maven-plugin</artifactId>
  		<version>${spring-cloud-contract-maven-plugin.verison}</version>
  		<extensions>true</extensions>
  		<configuration>
        <!-- 生成するテストがextendsするクラス -->
  			<baseClassForTests>
  				com.b1a9idps.springcloudcontractsample.producer.TestBase
  			</baseClassForTests>
        <!-- デフォルトがJUnit5で利用できるように（デフォルトはJUnit4） -->
  			<testFramework>JUNIT5</testFramework>
  		</configuration>
  	</plugin>
  </plugins>
</build>
```

TestBase.java
```
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
// DIコンテナを破棄するタイミングをコントロールする
@DirtiesContext
public abstract class TestBase {
  @BeforeEach
  public void setup(WebApplicationContext context) {
      RestAssuredMockMvc.mockMvc(
              MockMvcBuilders.webAppContextSetup(context).build());
  }
}
```

## Contractを追加
GroovyかYAMLで記述します。デフォルトのパスは、 `$rootDir/src/test/resources/contracts` です。

brand.yml
```
request:
  method: GET
  url: /brands
  headers:
    Content-Type: application/json
response:
  status: 200
  body:
    brands:
      - name: "STOF"
        designer:: "Tanita"
  headers:
    Content-Type: application/json
```

期待するリクエストとレスポンスをそれぞれ記述します。bodyを別でjsonファイルを定義することもできます。

brand.yml
```
request:
  method: GET
  url: /brands
  headers:
    Content-Type: application/json
response:
  status: 200
  bodyFromFile: brand_response.json
  headers:
    Content-Type: application/json
```

## テストクラスを生成する
`./mvnw clean install` を実行することでテストクラスが生成して、スタブを作ってローカルレポジトリにインストールします。

```
...

[INFO] Generating server tests source code for Spring Cloud Contract Verifier contract verification
[INFO] Will use contracts provided in the folder [/Users/uchitate/study/producer/src/test/resources/contracts]
[INFO] Directory with contract is present at [/Users/uchitate/study/producer/src/test/resources/contracts]
[INFO] Test Source directory: /Users/uchitate/study/producer/target/generated-test-sources/contracts added.
[INFO] Using [com.b1a9idps.springcloudcontractsample.producer.TestBase] as base class for test classes, [null] as base package for tests, [null] as package with base classes, base class mappings []
[INFO] Creating new class file [/Users/uchitate/study/producer/target/generated-test-sources/contracts/com/b1a9idps/springcloudcontractsample/producer/ContractVerifierTest.java]
[INFO] Generated 1 test classes.
[INFO]
[INFO] --- spring-cloud-contract-maven-plugin:2.1.3.RELEASE:convert (default-convert) @ producer ---
[INFO] Will use contracts provided in the folder [/Users/uchitate/study/producer/src/test/resources/contracts]
[INFO] Copying Spring Cloud Contract Verifier contracts to [/Users/uchitate/study/producer/target/stubs/META-INF/com.b1a9idps.spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/contracts]. Only files matching [.*] pattern will end up in the final JAR with stubs.
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 2 resources
[INFO] Converting from Spring Cloud Contract Verifier contracts to WireMock stubs mappings
[INFO]      Spring Cloud Contract Verifier contracts directory: /Users/uchitate/study/producer/src/test/resources/contracts
[INFO] Stub Server stubs mappings directory: /Users/uchitate/study/producer/target/stubs/META-INF/com.b1a9idps.spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/mappings
[INFO] Creating new stub [/Users/uchitate/study/producer/target/stubs/META-INF/com.b1a9idps.spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/mappings/brand.json]
[INFO]
[INFO] --- maven-resources-plugin:3.1.0:testResources (default-testResources) @ producer ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 2 resources
[INFO] skip non existing resourceDirectory /Users/uchitate/study/producer/target/generated-test-resources/contracts
[INFO]
[INFO] --- maven-compiler-plugin:3.8.1:testCompile (default-testCompile) @ producer ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 2 source files to /Users/uchitate/study/producer/target/test-classes
[INFO]
[INFO] --- maven-surefire-plugin:2.22.2:test (default-test) @ producer ---

...
// テスト実行
...

[INFO] --- spring-cloud-contract-maven-plugin:2.1.3.RELEASE:generateStubs (default-generateStubs) @ producer ---
[INFO] Files matching this pattern will be excluded from stubs generation []
[INFO] Building jar: /Users/uchitate/study/producer/target/producer-0.0.1-SNAPSHOT-stubs.jar
[INFO]
[INFO] --- maven-jar-plugin:3.1.2:jar (default-jar) @ producer ---
[INFO] Building jar: /Users/uchitate/study/producer/target/producer-0.0.1-SNAPSHOT.jar
[INFO]
[INFO] --- spring-boot-maven-plugin:2.2.0.RELEASE:repackage (repackage) @ producer ---
[INFO] Replacing main artifact with repackaged archive
[INFO]
[INFO] --- maven-install-plugin:2.5.2:install (default-install) @ producer ---
[INFO] Installing /Users/uchitate/study/producer/target/producer-0.0.1-SNAPSHOT.jar to /Users/uchitate/.m2/repository/com/b1a9idps/spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/producer-0.0.1-SNAPSHOT.jar
[INFO] Installing /Users/uchitate/study/producer/pom.xml to /Users/uchitate/.m2/repository/com/b1a9idps/spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/producer-0.0.1-SNAPSHOT.pom
[INFO] Installing /Users/uchitate/study/producer/target/producer-0.0.1-SNAPSHOT-stubs.jar to /Users/uchitate/.m2/repository/com/b1a9idps/spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/producer-0.0.1-SNAPSHOT-stubs.jar
```

生成されたテストクラス（ContractVerifierTest.java）
```
public class ContractVerifierTest extends TestBase {

	@Test
	public void validate_brand() throws Exception {
		// given:
			MockMvcRequestSpecification request = given()
					.header("Content-Type", "application/json");

		// when:
			ResponseOptions response = given().spec(request)
					.get("/brands");

		// then:
			assertThat(response.statusCode()).isEqualTo(200);
			assertThat(response.header("Content-Type")).isEqualTo("application/json");
		// and:
			DocumentContext parsedJson = JsonPath.parse(response.getBody().asString());
			assertThatJson(parsedJson).array("['brands']").contains("['designer']").isEqualTo("Tanita");
			assertThatJson(parsedJson).array("['brands']").contains("['name']").isEqualTo("STOF");
	}

}
```

# Consumer
## BrandServiceの実装
BrandServiceImpl.java
```
@Service
public class BrandServiceImpl implements BrandService {
  private final RestTemplate restTemplate;
  private final URI producerUrl;

  public BrandServiceImpl(RestTemplateBuilder restTemplateBuilder, @Value("${producer.url}") String producerUrl) {
      this.restTemplate = restTemplateBuilder.build();
      this.producerUrl = UriComponentsBuilder.fromHttpUrl(producerUrl).build().toUri();
  }

  @Override
  public BrandListDto list() {
      HttpHeaders httpHeaders = new HttpHeaders();
      httpHeaders.add(HttpHeaders.CONTENT_TYPE, APPLICATION_JSON_VALUE);

      ResponseEntity<BrandListDto> responseEntity = restTemplate.exchange(
              producerUrl,
              HttpMethod.GET,
              new HttpEntity<>(httpHeaders),
              new ParameterizedTypeReference<>() {});
      return responseEntity.getBody();
  }
}
```

## Spring Cloud Contractを依存関係に追加
Producer側とほぼ同じなので説明は省略します。

pom.xml
```
<dependencies>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-contract-stub-runner</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>

<dependencyManagement>
  <dependencies>
  	<dependency>
  		<groupId>org.springframework.cloud</groupId>
  		<artifactId>spring-cloud-dependencies</artifactId>
  		<version>${spring-cloud.version}</version>
  		<type>pom</type>
  		<scope>import</scope>
  	</dependency>
  </dependencies>
</dependencyManagement>

<build>
  <plugins>
  	<plugin>
  		<groupId>org.springframework.cloud</groupId>
  		<artifactId>spring-cloud-contract-maven-plugin</artifactId>
  		<version>${spring-cloud-contract-maven-plugin.verison}</version>
  		<configuration>
  			<testFramework>JUNIT5</testFramework>
  		</configuration>
  	</plugin>
  </plugins>
</build>
```

## テストを書く

/test/resources/application.yaml
```
producer:
  url: http://localhost:8080/brands
```

BrandServiceImplTest.java
```
// StubRunnnerExtension.classを登録する
@ExtendWith({SpringExtension.class, StubRunnerExtension.class})
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureStubRunner(ids = {"com.b1a9idps.spring-cloud-contract-sample:producer:+:stubs:8080"}, stubsMode = StubsMode.LOCAL)
class BrandServiceImplTest {
  @Autowired
  private BrandService brandService;

  @Test
  void list() {
      Assertions.assertThat(brandService.list().getBrands())
              .extracting(Brand::getName, Brand::getDesigner)
              .containsExactly(Tuple.tuple("STOF", "Tanita"));
  }
}
```


`@AutoConfigureStubRunner` を付与してスタブ生成の対象を指定します。idsに指定する値は、 `[groupId]:artifactId[:version][:classifier][:port]` です。.m2レポジトリに `.m2/repository/com/b1a9idps/spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/producer-0.0.1-SNAPSHOT-stubs.jar` とjarがインストールされているので、 `com.b1a9idps.spring-cloud-contract-sample:producer:+:stubs:8080` と指定します。バージョンを `+` で指定すると最新バージョンを設定します。

### テストを実行

```
2019-11-19 00:07:15.872  INFO 24517 --- [           main] o.s.c.c.s.AetherStubDownloaderBuilder    : Will download stubs and contracts via Aether
2019-11-19 00:07:15.874  INFO 24517 --- [           main] o.s.c.c.stubrunner.AetherStubDownloader  : Remote repos not passed but the switch to work offline was set. Stubs will be used from your local Maven repository.
2019-11-19 00:07:15.984  INFO 24517 --- [           main] o.s.c.c.stubrunner.AetherStubDownloader  : Desired version is [+] - will try to resolve the latest version
2019-11-19 00:07:15.997  INFO 24517 --- [           main] o.s.c.c.stubrunner.AetherStubDownloader  : Resolved version is [0.0.1-SNAPSHOT]
2019-11-19 00:07:16.007  INFO 24517 --- [           main] o.s.c.c.stubrunner.AetherStubDownloader  : Resolved artifact [com.b1a9idps.spring-cloud-contract-sample:producer:jar:stubs:0.0.1-SNAPSHOT] to /Users/uchitate/.m2/repository/com/b1a9idps/spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/producer-0.0.1-SNAPSHOT-stubs.jar
2019-11-19 00:07:16.010  INFO 24517 --- [           main] o.s.c.c.stubrunner.AetherStubDownloader  : Unpacking stub from JAR [URI: file:/Users/uchitate/.m2/repository/com/b1a9idps/spring-cloud-contract-sample/producer/0.0.1-SNAPSHOT/producer-0.0.1-SNAPSHOT-stubs.jar]
2019-11-19 00:07:16.016  INFO 24517 --- [           main] o.s.c.c.stubrunner.AetherStubDownloader  : Unpacked file to [/var/folders/0z/n7t2zxm566zfmzbtg7qdc6_80000gp/T/contracts17319340210365511943]
2019-11-19 00:07:16.705  INFO 24517 --- [           main] wiremock.org.eclipse.jetty.util.log      : Logging initialized @4424ms
2019-11-19 00:07:16.770  INFO 24517 --- [           main] w.org.eclipse.jetty.server.Server        : jetty-9.2.z-SNAPSHOT
2019-11-19 00:07:16.784  INFO 24517 --- [           main] w.o.e.j.server.handler.ContextHandler    : Started w.o.e.j.s.ServletContextHandler@5c60c08{/__admin,null,AVAILABLE}
2019-11-19 00:07:16.785  INFO 24517 --- [           main] w.o.e.j.server.handler.ContextHandler    : Started w.o.e.j.s.ServletContextHandler@212e39ee{/,null,AVAILABLE}
2019-11-19 00:07:16.810  INFO 24517 --- [           main] w.o.e.j.s.NetworkTrafficServerConnector  : Started NetworkTrafficServerConnector@173e960b{HTTP/1.1}{0.0.0.0:8080}
2019-11-19 00:07:16.811  INFO 24517 --- [           main] w.org.eclipse.jetty.server.Server        : Started @4532ms
2019-11-19 00:07:16.812  INFO 24517 --- [           main] o.s.c.contract.stubrunner.StubServer     : Started stub server for project [com.b1a9idps.spring-cloud-contract-sample:producer:0.0.1-SNAPSHOT:stubs] on port 8080
2019-11-19 00:07:17.082  INFO 24517 --- [tp2142521143-31] /__admin                                 : RequestHandlerClass from context returned com.github.tomakehurst.wiremock.http.AdminRequestHandler. Normalized mapped under returned 'null'
2019-11-19 00:07:17.106  INFO 24517 --- [tp2142521143-31] WireMock                                 : Admin request received:
127.0.0.1 - POST /mappings

Connection: [keep-alive]
User-Agent: [Apache-HttpClient/4.5.5 (Java/13)]
Host: [localhost:8080]
Content-Length: [225]
Content-Type: [text/plain; charset=UTF-8]
{
  "id" : "a18b18d9-bf53-478a-be02-c4b05d417911",
  "request" : {
    "url" : "/ping",
    "method" : "GET"
  },
  "response" : {
    "status" : 200,
    "body" : "OK"
  },
  "uuid" : "a18b18d9-bf53-478a-be02-c4b05d417911"
}

2019-11-19 00:07:17.180  INFO 24517 --- [tp2142521143-32] WireMock                                 : Admin request received:
127.0.0.1 - POST /mappings

Connection: [keep-alive]
User-Agent: [Apache-HttpClient/4.5.5 (Java/13)]
Host: [localhost:8080]
Content-Length: [227]
Content-Type: [text/plain; charset=UTF-8]
{
  "id" : "d4c408f0-344e-4994-9118-f3844404a3fc",
  "request" : {
    "url" : "/health",
    "method" : "GET"
  },
  "response" : {
    "status" : 200,
    "body" : "OK"
  },
  "uuid" : "d4c408f0-344e-4994-9118-f3844404a3fc"
}

2019-11-19 00:07:17.246  INFO 24517 --- [tp2142521143-33] WireMock                                 : Admin request received:
127.0.0.1 - POST /mappings

Connection: [keep-alive]
User-Agent: [Apache-HttpClient/4.5.5 (Java/13)]
Host: [localhost:8080]
Content-Length: [493]
Content-Type: [text/plain; charset=UTF-8]
{
  "id" : "3e1ac4f8-4565-42b5-946a-e136e1822941",
  "request" : {
    "url" : "/brands",
    "method" : "GET",
    "headers" : {
      "Content-Type" : {
        "equalTo" : "application/json"
      }
    }
  },
  "response" : {
    "status" : 200,
    "body" : "{\"brands\":[{\"name\":\"STOF\",\"designer\":\"Tanita\"}]}",
    "headers" : {
      "Content-Type" : "application/json"
    },
    "transformers" : [ "response-template" ]
  },
  "uuid" : "3e1ac4f8-4565-42b5-946a-e136e1822941"
}

2019-11-19 00:07:17.313  INFO 24517 --- [           main] o.s.c.c.stubrunner.StubRunnerExecutor    : All stubs are now running RunningStubs [namesAndPorts={com.b1a9idps.spring-cloud-contract-sample:producer:0.0.1-SNAPSHOT:stubs=8080}]
2019-11-19 00:07:17.358  INFO 24517 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 53672 (http) with context path ''
2019-11-19 00:07:17.362  INFO 24517 --- [           main] c.b.s.c.s.impl.BrandServiceImplTest      : Started BrandServiceImplTest in 3.981 seconds (JVM running for 5.083)
2019-11-19 00:07:17.365  WARN 24517 --- [           main] o.s.c.c.stubrunner.StubRunnerFactory     : No stubs to download have been passed. Most likely you have forgotten to pass them either via annotation or a property

2019-11-19 00:07:17.735  INFO 24517 --- [tp2142521143-31] /                                        : RequestHandlerClass from context returned com.github.tomakehurst.wiremock.http.StubRequestHandler. Normalized mapped under returned 'null'
2019-11-19 00:07:17.801  INFO 24517 --- [tp2142521143-31] WireMock                                 : Request received:
127.0.0.1 - GET /brands

Connection: [keep-alive]
User-Agent: [Apache-HttpClient/4.5.9 (Java/13)]
Host: [localhost:8080]
Accept-Encoding: [gzip,deflate]
Accept: [application/json, application/*+json]
Content-Type: [application/json]



Matched response definition:
{
  "status" : 200,
  "body" : "{\"brands\":[{\"name\":\"STOF\",\"designer\":\"Tanita\"}]}",
  "headers" : {
    "Content-Type" : "application/json"
  },
  "transformers" : [ "response-template" ]
}

Response:
HTTP/1.1 200
Content-Type: [application/json]
Matched-Stub-Id: [3e1ac4f8-4565-42b5-946a-e136e1822941]



2019-11-19 00:07:17.913  WARN 24517 --- [           main] .StubRunnerWireMockTestExecutionListener : You've used fixed ports for WireMock setup - will mark context as dirty. Please use random ports, as much as possible. Your tests will be faster and more reliable and this warning will go away
2019-11-19 00:07:17.923  INFO 24517 --- [           main] w.o.e.j.s.NetworkTrafficServerConnector  : Stopped NetworkTrafficServerConnector@173e960b{HTTP/1.1}{0.0.0.0:8080}
2019-11-19 00:07:17.924  INFO 24517 --- [           main] w.o.e.j.server.handler.ContextHandler    : Stopped w.o.e.j.s.ServletContextHandler@212e39ee{/,null,UNAVAILABLE}
2019-11-19 00:07:17.924  INFO 24517 --- [           main] w.o.e.j.server.handler.ContextHandler    : Stopped w.o.e.j.s.ServletContextHandler@5c60c08{/__admin,null,UNAVAILABLE}
2019-11-19 00:07:17.925  WARN 24517 --- [           main] w.o.e.j.util.thread.QueuedThreadPool     : qtp2142521143{STOPPING,8<=8<=10,i=3,q=6} Couldn't stop Thread[qtp2142521143-28,5,]
2019-11-19 00:07:17.925  WARN 24517 --- [           main] w.o.e.j.util.thread.QueuedThreadPool     : qtp2142521143{STOPPING,8<=8<=10,i=0,q=4} Couldn't stop Thread[qtp2142521143-29,5,]
2019-11-19 00:07:17.926  INFO 24517 --- [           main] o.s.s.concurrent.ThreadPoolTaskExecutor  : Shutting down ExecutorService 'applicationTaskExecutor'
Class transformation time: 0.040030372s for 10526 classes or 3.8029994299828998E-6s per class

Process finished with exit code 0
```

これがテストを実行時に吐き出されるログです。テストが実行されるまでに「1. ローカルレポジトリからstubのjarをインストール」「2. 8080番ポートでモックサーバを起動」が行われています。

## まとめ
Producer側では、Contractに基づいたテストが生成され、Consumer側で利用するためのスタブを生成してローカル（リモート）レポジトリにインストールします。Consumer側では、生成されたスタブを使ってテストを実行します。
Spring Cloud Contractを使えば、Consumerが定義したContractをProviderが守っていることが担保できます。また、Consumerも実サービスに近いテストを行うことができます。とてもよいですね！！！

長くなりすぎたので、別記事でSpring REST Docsとの連携は書きます！
