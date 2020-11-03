---
template: page
title: About me
slug: /pages/about
draft: false
---
## ○ 職歴
### コイニー株式会社（2018/06 ~ ）
雇用形態は正社員。Webアプリケーションエンジニアとして、STORES決済の開発に携わる。

#### 2020/01 ~ 2020/07 入金サイクルの短縮化
**利用技術：** Java 1.8、Spring Boot 2.2.x、AWS(Elastic Beanstalk、Cloud Watch) 

競合サービスよりも加盟店さまへの入金までのスピードが遅かったため、2週間から翌々日に入金できるようにした。仕様検討、実装、テストを担当。\
入金周りのコードはサービスローンチ時からほぼ手をいれおらず、実際の仕様を表現した実装になっていなかったり、特に方針もなく実装されていたので機能開発に加えて大規模リファクタリングも行った。\
リリース直後から入金依頼が行われていて、加盟店さまにとってとても価値があることができたと実感できた。

#### 2020/01 一次請けコールセンターの業務改善
**利用技術：** Java 1.8、Spring Boot 2.2.x、React、TypeScript

社内専用サービスは、コールセンターの方たちは参照しかできないように制限をかけていたことで、冗長な書き込み系の作業が発生していたため、この工数を削減した。仕様検討、実装（フロントエンド・バックエンド）、テストを担当。\
バックエンドはアクセス制限の変更（一部POSTを可能に）を行い、フロントエンドは表示内容の変更を行った。

#### 2019/05 ~ 2019/12 Spring Boot 1.5.xからSpring Boot 2.2.xへのバージョンアップ
**利用技術：** Java 1.8、Spring Boot 2.2.x、Spring Cloud Config Server、Gradle

5レポジトリをGradle 4.10.2以上、Spring Boot 2.2.xにしてリリースした。方針検討、実装、テストを担当。\
リリースノートや公式ドキュメント、ソースコードを読みながらバージョンアップを行い、リファクタリングも同時に行った。\
QAチームと一緒にテスト項目書を作ってテストをしたのもあって、特に大きな問題もなくリリースできた。

このときの様子を[note](https://note.com/b1a9idps/n/n0b9ca2ee57a2)にまとめている。

#### 2019/04 認証・認可周りの改修
**利用技術：** Java 1.8、Spring Boot 1.5.x

Spring SecurityのSecurity Filter Chainを通過した後のSpring Webに処理が移ったときに認証・認可を行なっていた。Spring的に正しい実装方法ではなく、またサービス拡張を考えたときに拡張しづらくなることを考えて改修した。方針検討、実装、テストを担当。\
Spring Securityを適切に利用することでセキュリティが高く、今後の拡張もしやすくなった。

#### 2018/08 ~ 2019/03 コールセンターとカスタマーサポートチーム間の業務改善
**利用技術：** Java 1.8、Spring Boot 2.1.x、AWS(Elastic Beanstalk、Cloud Watch、Amazon Aurora、Cognito、S3)

コールセンターの方たちは社内専用サービスを利用することができず、スプレッドシート等でカスタマーサポートチームを必要な情報をやりとりしている状況だった。業務改善のために、社内専用サービスをコールセンターの方たちも利用できるようにした。API設計、実装、インフラ設計・構築、テスト担当。\
当時社内に知見のなかったSpring Boot 2やMicrometer、TestContainersを導入しました。Amazon CognitoのSDKとSpring Security使って認証・認可処理を実装するのは特に苦戦した。TestContainersを導入したことで、本番と同じDBMSを利用したテストを書けるようになり、よりクオリティ高いテストを書けるようになった。\
開発以外では、プロジェクト全体の進捗管理を行ったり、QAやビジネスサイドの人たち向けに噛み砕いた資料を作って仕様説明会を行ったりした。

--- 

### 株式会社デファクトスタンダード（2018/11 ~ ）
雇用形態は、業務委託。Webアプリケーションエンジニアとして、Fashion Charity Projectの開発に携わる。

#### 2020/05 ~ 2020/06 断チャリプロジェクト
**利用技術：** Java 1.8、Spring Boot 2.2.x、HTML(Thymeleaf)、jQuery、PostgresSQL、Docker\
**URL：** https://www.furusato-tax.jp/feature/a/fashion_charity_project

[ふるさとチョイス](https://www.furusato-tax.jp/?header) と連携して、自治体に寄附できるようにするようにした。内部設計、実装、テストを担当。\
新型コロナウイルスに関連したプロジェクトであり、リリースまでのスピード感が必要だった。立ち上げからリリースまで3週間で行った。\
リリース会見が行われるため通常の寄付よりも流入が大きくそうだったので、これまで以上にパフォーマンスを意識して実装をした。特に大きな問題は発生しなかった。

#### 2020/04 ブランドページのリニューアル
**利用技術：** Java 1.8、Spring Boot 2.2.x、HTML(Thymeleaf)、jQuery、PostgresSQL、Docker

[ブランド一覧ベージ](https://www.waja.co.jp/fcp/brands) をブランディアで取り扱っているブランドの一覧に変更。内部設計、実装、テストを担当。\
ブランド一覧の変更や月1で更新するためのCSVアップロード機能の実装を行った。月1しか更新されないため、キャッシュの実装も行った。

#### 2019/01 認証認可の実装リファクタリング
**利用技術：** Java 1.8、Spring Boot 2.0.2、HTML(Thymeleaf)、jQuery、PostgresSQL、Docker

Spring Security的に適切なクラスで適切な処理を書いていなかったため、リファクタリングを行った。方針検討、実装、テストを担当。\
また、外部APIへの無駄なリクエストがあったり、セッションで保存しているログイン情報の取り扱いミスがあったりしたので、同時にリファクタリングも行った。

#### 2018/12 ~ 2019/05 マイページ実装
**利用技術：** Java 1.8、Spring Boot 2.0.2、HTML(Thymeleaf)、jQuery、PostgresSQL、Docker

寄付者が自分の寄付実績を確認できるようにマイページを実装した。内部設計、実装、テストを担当。\
複数のテーブルを結合して実績を出すため、Criteria APIを使ってSQLを組み立てると複雑になりすぎることを懸念して、Native Queryを書くことにした。テスト項目が多かったこと、ヘッダのリプレースも行ったこともあり当初のスケジュールより遅めのリリースになってしまった。リリース後は、クリティカルなバグは出なかった。

---

### 株式会社scrap&build（2020/01 ~ ）
雇用形態は、業務委託。Webアプリケーションエンジニアとして、トライアングルソース業務支援やECサイト構築に携わる。

--- 

### 株式会社waja（2017/04 ~ 2018/05）
雇用形態は正社員。Webアプリケーションエンジニアとして、ファッションECの開発、Fashion Charity Projectの開発に携わる。

#### 2018/03 ~ 2018/05 Fashion Charity Projectのフルリプレース
**利用技術：** Java 1.8、Spring Boot 2.0.2、HTML(Thymeleaf)、jQuery、PostgresSQL、Docker

サービスコンセプトの変更があったり、拡張性を考えていない作りになっていたりしたのでフルリプレースを行った。要件定義、内部設計、実装、テストを担当。\
ほぼ1人でフルリプレースを行った。テーブル定義の見直しやリファクタリングも同時に行った。Vagrant上で起動していて、DBは全エンジニアで共有という開発環境だったので、Docker上でDBを起動して、アプリケーションはホストで直接起動できるようにして開発環境の改善も行った。
フルリプレース及び申込フローの改善によって、寄付申込数を増やすことができた。

#### 2017/05 ~ 2017/08 過去注文に追加できる機能の実装
**利用技術：** Java 1.8、Spring 4.2.x、HTML、Thymeleaf、JSP、jQuery、PostgresSQL

APIの設計・実装及びその他サーバサイドの実装を行った。API設計、実装、テストを担当。\
より良いUIにするために、文言などの提案を行った。可読性をあげるため、コーダーが作ったHTMLをJSPに書き換える無駄な時間を削減するためにJSPからThymeleafを導入した。
また、最後のテスト時にはテスト項目書を作成し、テスト精度向上に努めた。

--- 

### タグバンガーズ株式会社（2015/05 ~ 2017/03）
雇用形態は正社員。Webアプリケーションエンジニアとして、受託開発に携わる。

#### 2016/11 機械メーカポータルサイトの機能追加
**利用技術：** Java 1.8、Spring Boot 1.4.x、HTML、Thymeleaf、Riot.js、PostgresSQL

API設計、実装、テストを担当。\
サーバサイドは、APIの実装及びユニットテストを行い、フロントサイドも少し実装した。APIを実装して、これまで以上にHTTP通信を意識し、よりよいシステムにするために正しいHTTPメソッドを使うことや正しいステータスコードを返すように心がけた。

#### 2015/10 ~ 2016/01 地図制作会社のオンプレミスからAWSへの移行
**利用技術：** AWS(Cloud Formation)、bash

設計、実装、テストを担当。\
Cloud Formationを使い、30 ~ 50台のオンプレミスサーバのAWSへの移行のための補佐を行った。約30のテンプレートを作成した。タグ名にハイフンを指定できないなどCloud Formationで実現できない項目は、bashでスクリプトを作成して解決した。打ち合わせにも毎回参加し、進捗報告や要望などについて回答した。

---

### コムチュア株式会社（2014/4 ~ 2015/4）
雇用形態は正社員。システムエンジニアとして、統合監視ツールの導入をメインで行った。

#### 2015/02 ~ 2015/03 クラウド型の統合運用管理基盤サービスのシナリオテスト
AWS上にある統合運用管理基盤サービスのシナリオテストを行った。

#### 2014/06 ~ 2015/04 様々の企業のサーバに運用監視ソフトウェアの導入
携わった案件数：約25案件（規模は大小様々）

## ○ 業務外の活動
### 2016/12~ 日本Javaユーザーグループ
毎月の勉強会や年2回のカンファレンスの運営、CFP応募サイトやWebサイトの開発などを行なう。

### 技術コミュニティでの登壇
JJUC CCCやJSUG勉強会等での登壇。

- [決済サービスのSpring Bootのバージョンを2系に上げた話](https://www.slideshare.net/RyosukeUchitate/spring-boot2)
- [Form認証で学ぶSpring Security入門](https://www.slideshare.net/RyosukeUchitate/formspring-security)
- [Amazon Cognito使って認証したい？それならSpring Security使いましょう！](https://www.slideshare.net/RyosukeUchitate/amazon-cognitospring-security)
- [春だしBannerで遊バナいか？](https://www.slideshare.net/RyosukeUchitate/banner-94283851)
- [ユニットテストのアサーション　流れるようなインターフェースのAssertJを添えて　入門者仕立て](https://www.slideshare.net/RyosukeUchitate/assertj-82260732)
- [Spring 超入門~Springと出会ってから１年半~](https://www.slideshare.net/RyosukeUchitate/springspring1)
- [Boot starterが語るSpring Bootの仕組み](https://www.slideshare.net/RyosukeUchitate/spring-io-2016-63373522)
 
## ○ Tech Skill
- 業務
    - Java 1.8 ~
    - Spring Framework, Spring Boot
    - AWS
    - React
- 独学
    - Kotlin(独学)
    - Vue.js(独学)

## ○ SNS

* [Twitter](https://twitter.com/b1a9idps)
* [GitHub](https://github.com/b1a9id)
* [SlideShare](https://www.slideshare.net/RyosukeUchitate)
* [Old Blog](https://uchi-fashion.hatenablog.com/)
* [note](https://note.com/b1a9idps)
* [Facebook](https://ja-jp.facebook.com/people/Ryosuke-Uchitate/100004147568068)
* [wear](http://wear.jp/blackid/)
