---
template: page
title: About me
slug: /pages/about
draft: false
---
## 職歴
### コイニー株式会社（2018/06 ~ ）
雇用形態は正社員。Webアプリケーションエンジニアとして、STORES決済の開発に携わる。

#### 2020/01 ~ 2020/07 入金サイクルの短縮化
**利用技術：** Java 1.8、Spring 2.2.x、AWS(Elastic Beanstalk、Cloud Watch) 

競合サービスよりも加盟店さまへの入金までのスピードが遅かったため、2週間から翌々日に入金できるようにした。仕様検討、実装、テストを担当。\
入金周りのコードはサービスローンチ時からほぼ手をいれおらず、実際の仕様を表現した実装になっていなかったり、特に方針もなく実装されていたので機能開発に加えて大規模リファクタリングも行った。\
リリース直後から入金依頼が行われていて、加盟店さまにとってとても価値があることができたと実感できた。

#### 2020/01 一次請けコールセンターの業務改善
**利用技術：** Java 1.8、Spring 2.2.x、React、TypeScript

社内専用サービスは、コールセンターの方たちは参照しかできないように制限をかけていたことで、冗長な書き込み系の作業が発生していたため、この工数を削減した。仕様検討、実装（フロントエンド・バックエンド）、テストを担当。\
バックエンドはアクセス制限の変更（一部POSTを可能に）を行い、フロントエンドは表示内容の変更を行った。

#### 2019/05 ~ 2019/12 Spring Boot 1.5.xからSpring Boot 2.2.xへのバージョンアップ
**利用技術：** Java 1.8、Spring Boot 2.2.x、Spring Cloud Config Server、Gradle

5レポジトリをGradle 4.10.2以上、Spring Boot 2.2.xにしてリリースした。方針検討、実装、テストを担当。\
リリースノートや公式ドキュメント、ソースコードを読みながらバージョンアップを行い、リファクタリングも同時に行った。\
QAチームと一緒にテスト項目書を作ってテストをしたのもあって、特に大きな問題もなくリリースできた。

このときの様子を[note](https://note.com/b1a9idps/n/n0b9ca2ee57a2)にまとめている。

#### 2019/04 認証・認可周りの改修
**利用技術：** Java 1.8、Spring 1.5.x

Spring SecurityのSecurity Filter Chainを通過した後のSpring Webに処理が移ったときに認証・認可を行なっていた。Spring的に正しい実装方法ではなく、またサービス拡張を考えたときに拡張しづらくなることを考えて改修した。方針検討、実装、テストを担当。\
Spring Securityを適切に利用することでセキュリティが高く、今後の拡張もしやすくなった。

#### 2018/08 ~ 2019/03 コールセンターとカスタマーサポートチーム間の業務改善
**利用技術：** Java 1.8、Spring 2.1.x、AWS(Elastic Beanstalk、Cloud Watch、Amazon Aurora、Cognito、S3)

コールセンターの方たちは社内専用サービスを利用することができず、スプレッドシート等でカスタマーサポートチームを必要な情報をやりとりしている状況だった。業務改善のために、社内専用サービスをコールセンターの方たちも利用できるようにした。API設計、実装、インフラ設計・構築、テスト担当。\
当時社内に知見のなかったSpring Boot 2やMicrometer、TestContainersを導入しました。Amazon CognitoのSDKとSpring Security使って認証・認可処理を実装するのは特に苦戦した。TestContainersを導入したことで、本番と同じDBMSを利用したテストを書けるようになり、よりクオリティ高いテストを書けるようになった。\
開発以外では、プロジェクト全体の進捗管理を行ったり、QAやビジネスサイドの人たち向けに噛み砕いた資料を作って仕様説明会を行ったりした。

### 株式会社デファクトスタンダード（2018/11 ~ ）
- Webアプリケーションエンジニア
  - Fashion Charity Projectの開発

### 株式会社scrap&build（2020/1 ~ ）
- Webアプリケーションエンジニア
  - トライアングルソース業務支援
  - トライアングルソースECサイト構築

### 株式会社waja（2017/4 ~ 2018/5）
- Webアプリケーションエンジニア
  - ファッションECの開発
  - Fashion Charity Projectのフルリプレース
  
### タグバンガーズ株式会社（2015/5 ~ 2017/3）
- Webアプリケーションエンジニア
  - 受託開発

### コムチュア株式会社（2014/4 ~ 2015/4）
- システムエンジニア
  - 統合監視ツールの導入

## スキル

* Java8 ~
* Spring Framework, Spring Boot
* AWS
* Vue.js(独学)

## SNS

* [Twitter](https://twitter.com/b1a9idps)
* [GitHub](https://github.com/b1a9id)
* [SlideShare](https://www.slideshare.net/RyosukeUchitate)
* [Old Blog](https://uchi-fashion.hatenablog.com/)
* [note](https://note.com/b1a9idps)
* [Facebook](https://ja-jp.facebook.com/people/Ryosuke-Uchitate/100004147568068)
* [wear](http://wear.jp/blackid/)
