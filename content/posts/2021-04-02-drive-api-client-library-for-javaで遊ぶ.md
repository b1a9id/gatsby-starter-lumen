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
