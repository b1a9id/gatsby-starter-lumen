---
template: post
title: Drive API Client Library for Javaで遊ぶ
slug: /posts/gdrive-java
draft: false
date: 2021-04-02T08:46:08.841Z
description: Drive API Client Library for Javaで遊んだのでまとめます。Google
  Driveのファイル一覧取得、ファイルのアップロード、ファイルのダウンロードを行なっています。
category: GoogleDrive
tags:
  - Java
  - Spring
  - Google
---
Drive API Client Library for Javaで遊んだのでまとめます。

```
環境
- Java 11
- Spring Boot 2.4.4
- Google Auth Library 0.25.2
- Drive API Client Library for Java v3-rev20210315-1.31.0
```

## GCPコンソール側の設定
[google drive の Quickstart（サービスアカウント編）](https://playwithgoogleapi.hatenablog.com/entry/2019/06/30/133415) を参考にさせていただきました。\
GCPコンソールでの設定は上記の記事をみてください。

## Credentialの作成
Google Drive APIにリクエストするときにクレデンシャル情報を渡す必要があります。GCPコンソールからダウンロードしたサービスアカウントキーファイル（JSON）からインスタンスを作成します。\

`gist:b1a9id/2f982a7c564d3835c4f19f34e2646e76?file=Runner.java`  

## Google Driveで遊ぶ
親ディレクトリにあるファイル一覧取得、ファイルのアップロード、ファイルのダウンロードを行なっています。\

`gist:b1a9id/a6ea2fa08b0db18a9f5cb0135ce801c3?file=FileServiceImpl.java`   

ほぼ各ライブラリのREADME.mdを見ながら実装したのでそこまで解説することはないです。詳しくは[GitHubレポジトリ](https://github.com/b1a9id/google-drive-sandbox)を見てください。

## 実行結果
正常に動いているようです。

`gist:b1a9id/3b30340468302323a349494730631861?file=log`  

## Links
- [GitHubレポジトリ](https://github.com/b1a9id/google-drive-sandbox)
- [google-auth-library-java](https://github.com/googleapis/google-auth-library-java)
- [google-api-java-client-services](https://github.com/googleapis/google-api-java-client-services/tree/master/clients/google-api-services-drive/v3)
