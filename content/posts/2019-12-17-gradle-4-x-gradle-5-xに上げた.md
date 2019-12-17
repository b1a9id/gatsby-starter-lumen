---
template: post
title: Gradle 4.x -> Gradle 5.xに上げた
slug: /posts/versionup-gradle-5
draft: false
date: 2019-12-18T00:00:00.000Z
description: >-
  Spring Boot2系にあげたときにやったことをまとめようと思います。[関連記事]()今回はGradleの話です。[Upgrading your
  build from Gradle 4.x to
  5.0](https://docs.gradle.org/5.0/userguide/upgrading_version_4.html)を参考に作業しました。これだけじゃなかったと思うので思い出したら追記します。もうGradle
  6出ているんですが、まだそんなに対応していないのでとりあえず5の話です。
category: Gradle
tags:
  - Build Tool
---
Spring Boot2系にあげたときにやったことをまとめようと思います。[関連記事]()
今回はGradleの話です。[Upgrading your build from Gradle 4.x to 5.0](https://docs.gradle.org/5.0/userguide/upgrading_version_4.html)を参考に作業しました。
これだけじゃなかったと思うので、思い出したら追記します。もうGradle 6出ているんですが、まだそんなに対応していないのでとりあえず5の話です。

## 4系の最新までバージョンをあげる
まず、4系の最新までバージョンをあげます。
build.gradleにこのように書いて、 `./gradlew wrapper` を実行します。
```
wrapper {
gradleVersion = "4.10.2"
distributionType = Wrapper.DistributionType.ALL
}
```

## ビルド
次にビルドです。  
```
./gradlew build
```

コマンドを実行すると、Gradle 5.0で非互換になる機能を利用しているとメッセージが出力されることがあります。
`--warning-mode all` オプションをつけて実行すると詳細を確認することができます。[参考](https://docs.gradle.org/5.0/userguide/command_line_interface.html#sec:command_line_warnings)

## build.gradleの書き換え
大きな書き換えは、dependencies指定する`compilie`を`implementation`に書き換えることでした。4.7からcompileとかruntimeなどが非推奨になっています。[参考](https://docs.gradle.org/4.7/userguide/java_plugin.html#sec:java_plugin_and_dependency_management)  
`implementation`に変更することで依存関係が伝播しなくなるため明確になり、結合度が低くなります。

fooモジュールとbarモジュールで構成されたマルチモジュールプロジェクトがあるとします。
build.gradle（fooモジュール）
```
dependencies {
    implementation "com.fasterxml.jackson.dataformat:jackson-dataformat-csv"
}
```

build.gradle（barモジュール）
```
dependencies {
    implementation project (":foo")
}
```

`jackson-dataformat-csv`が`implementation`で指定されているので、barモジュールでは`jackson-dataformat-csv`の依存関係は伝播しません。

## アーカイブファイルの名前を変更する
5.1からアーカイブファイルの名前を変更するとき`archivesBaseName=hoge` を使うようになりました。 `jar.baseName=hoge` は非推奨になりました。[参考](https://docs.gradle.org/5.1/dsl/org.gradle.api.tasks.bundling.Jar.html)

## おまけ
Gradle 3.x -> 4.10.2にするときにLombokが怒ってました。Lombok 1.18.2以上にしてねとのことでした。
[参考](https://github.com/rzwitserloot/lombok/issues/1782)
