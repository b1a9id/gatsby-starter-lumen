---
template: post
title: Spring Boot で AWS Systems Manager パラメータストアを利用する
slug: /posts/spring-boot-parameter-store
draft: true
date: 2020-10-11T07:19:06.861Z
description: Spring BootのアプリケーションでAWS System Manager パラメータストアを利用して、値を取得する。
category: Config
tags:
  - Spring Boot
  - AWS
---
Spring BootのアプリケーションでAWS System Manager パラメータストアを利用して、値を取得しようと思います。

## AWS System Manager パラメータストアとは
設定データ管理と機密管理のための安全な階層型ストレージを提供してくれていて、パスワード、データベース文字列、AMI ID、ライセンスコードなどのデータをパラメータ値として保存できます。値はプレーンテキストまたは暗号化されたデータとして保存できます。

詳しい説明は、[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-parameter-store.html)を見てください。

## サンプル
### 環境
Spring Boot等のバージョンは次の通りです。

```
Java 11
Gradle 6.6.1
Spring Boot 2.3.4.RELEASE
Spring Cloud Hoxton.SR8
```

### パラメータの登録
#### 登録するパラメータのkey
デフォルトだと次のような3階層で設定するようになっています。\
`[prefix]/[name]_[アプリケーションのprofile(defaultの場合は省略可)]/[value]`

設定値の抜粋です。（値はデフォルト値）

```
- パラメータストアから取得される全プロパティで共有されるプレフィクス。第１階層の値。
  - aws.paramstore.prefix=/config
- 全サービスで共有されるコンテキスト名。第２階層の値。
  - aws.paramstore.default-context=application
- コンテキスト名とプロファイルの区切り文字.
  - aws.paramstore.profile-separator=_
- パラメータストアを利用するかどうか
  - aws.paramstore.enabled=true
```

取得するプロパティを作っているコードは [AwsParamStorePropertySourceLocator#PropertySource<?> locate(Environment)](https://github.com/spring-cloud/spring-cloud-aws/blob/v2.2.4.RELEASE/spring-cloud-aws-parameter-store-config/src/main/java/org/springframework/cloud/aws/paramstore/AwsParamStorePropertySourceLocator.java#L68-L116) にあります。

#### パラメータストアへの登録
パラメータストアにパラメータを登録します。今回は、DBへのアクセス情報を登録します。

| key | value |
| --- | --- |
| /config/sample/spring.datasource.url | jdbc:mysql://localhost:33306/sample |
| /config/sample/spring.datasource.username | docker |
| /config/sample/spring.datasource.password | docker |

### 依存関係
パラメータストアを利用するために追加する依存関係はこれだけです。

build.gradle\
`gist:b1a9id/3ed18a10c04b15c797e7ab3c63e3fb36?file=build.gradle`

### 設定ファイル
appliaction.yml(application.properties)には特に何も書かなくてOKですが、bootstrap.ymlにいくつかパラメータを書く必要があります。

application.yml\
`gist:b1a9id/048a8364381da15e14eb0833dbae92a0?file=application.yml`

パラメータストアから取得するのでkeyのみ書きます。\
`gist:b1a9id/048a8364381da15e14eb0833dbae92a0?file=application.yml&highlights=1-5`

ローカル環境でSpring Cloud AWSを使うためのおまじないです。アプリケーション起動時にメタデータからリージョン等を取得するのですが、ローカル環境だと取得に失敗してアプリケーションが起動しなくなってしまうために無効にしています。詳しくは、[Configuring region](https://docs.spring.io/spring-cloud-aws/docs/2.2.4.RELEASE/reference/html/#configuring-region) と [CloudFormation configuration in Spring Boot](https://docs.spring.io/spring-cloud-aws/docs/2.2.4.RELEASE/reference/html/#cloudformation-configuration-in-spring-boot) にあります。\
`gist:b1a9id/048a8364381da15e14eb0833dbae92a0?file=application.yml&highlights=6-12`

EC2MetadataUtilsがAWS上で動いているか取得しますが、AWS環境以外でのアプリケーション起動時にエラーログを出してしまって気持ち悪いので設定します。（なくても動作には何も問題ないのです）
`gist:b1a9id/048a8364381da15e14eb0833dbae92a0?file=application.yml&highlights=18-23`

### アプリケーションの起動
あとはアプリケーションを起動するだけです。

どのパラメータをパラメータストアから取得しているかを確認したい場合は、次の設定をbootstrap.ymlに書いてください。
```yml
logging:
  level:
    org:
      springframework:
        cloud:
          aws:
            paramstore:
              AwsParamStorePropertySource: debug
```

設定するとログにこんな感じで出力されます。
```
2020-10-11 18:35:27.847 DEBUG 55136 --- [           main] o.s.c.a.p.AwsParamStorePropertySource    : Populating property retrieved from AWS Parameter Store: spring.datasource.password
2020-10-11 18:35:27.849 DEBUG 55136 --- [           main] o.s.c.a.p.AwsParamStorePropertySource    : Populating property retrieved from AWS Parameter Store: spring.datasource.url
2020-10-11 18:35:27.849 DEBUG 55136 --- [           main] o.s.c.a.p.AwsParamStorePropertySource    : Populating property retrieved from AWS Parameter Store: spring.datasource.username
```

### プロファイルで設定値を分ける
一般的に、defaultプロファイルしか存在しないことはないかと思います。testプロファイルでは、テスト環境用のDBアクセス情報を取得するみたいなことも可能です。

#### パラメータストアへの登録
パラメータストアへの登録の仕方については上で説明したので省略します。

| key | value |
| --- | --- |
| /config/sample_test/spring.datasource.url | jdbc:mysql://localhost:33307/sample |
| /config/sample_test/spring.datasource.username | test |
| /config/sample_test/spring.datasource.password | test |

#### アプリケーションの起動
アクティブプロファイルをtestにして、起動するだけです。

## まとめ
思っていたよりは簡単にできましたが、AWSのプロファイルは`default`が使われるので変更したい場合は自前で設定書かないといけないみたいです。

### Links
[GitHub](https://github.com/b1a9id/spring-boot-parameter-store/tree/default)
[Spring Cloud AWS](https://docs.spring.io/spring-cloud-aws/docs/2.2.4.RELEASE/reference/html/)[]
[AWS Systems Manager パラメータストア
](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-parameter-store.html)