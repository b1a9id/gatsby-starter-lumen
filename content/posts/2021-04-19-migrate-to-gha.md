---
template: post
title: JenkinsからGitHub Actionsへの移行をキメた
slug: /posts/migrate-to-github-actions
draft: true
date: 2021-04-19T08:46:08.841Z
description: JenkinsからGitHub Actionsへ移行をキメたのでtipsまとめます。2019年までに作ったアプリケーションのデプロイ・リリース作業はJenkinsで行なっていました。2020年に入ってコンテナ化が進み、AWS CodeBuild・AWS CodeDeployを使ってデプロイするようになったり、一部ではGitHub Actionsを使ってデプロイするようになったりとデプロイ・リリース方法が多様化していきました。JenkinsはEC2インスタンス立てて、そこにインストールしていましたが長年メンテナンスされてなかったし、ジョブの作り上デプロイ完了待ちが発生していました。デプロイ・リリース方法を統一したいするというのが第1の目的でした。
category: CICD
tags:
  - Jenkins
  - GitHub Actions
---
社のCI/CDをJenkinsからGitHub Actionsに移行しました。

## 環境
- レポジトリは15くらい
- デプロイ環境は、Amazon ECSとAWS Elastic Beanstalk
- アプリケーションは全部Java / Spring Boot（Gradle）

## 移行の背景
2019年までに作ったアプリケーションのデプロイ・リリース作業はJenkinsで行なっていました。2020年に入ってコンテナ化が進み、AWS CodeBuild・AWS CodeDeployを使ってデプロイするようになったり、一部ではGitHub Actionsを使ってデプロイするようになったりとデプロイ・リリース方法が多様化していきました。\
JenkinsはEC2インスタンス立てて、そこにインストールしていましたが長年メンテナンスされてなかったし、ジョブの作り上デプロイ完了待ちが発生していました。

移行の決め手をまとめると、次のような感じです。
1. デプロイ・リリース方法が多様化されている上にちゃんとドキュメントがなく、全環境の手順把握してる人がいないため、使うツールや手順を統一したい
2. Jenkinsのメンテナンスされてこなかったし、これからもメンテナンスしたくない
3. ジョブの作り上、ビルド・デプロイに時間がかかるため、改善したい

既存で使われていたのが、AWS CodeBuild・AWS CodeDeployとGitHub Actionsだったのでこの2択でした。前者だと、設定ファイル結構用意しないといけないしデプロイ作業が手間そうだったので、GitHub Actionsに決めました。

## 移行作業
主に作ったワークフローは次の通りです。
1. ビルド用ワークフロー（PR作成・更新をトリガ）
2. テスト環境にデプロイするワークフロー（手動実行）
3. 本番環境にデプロイするワークフロー（手動実行）
4. 日次でテスト環境にデプロイするワークフロー(スケジューリングトリガ)

公式ドキュメントを読めばできることしかやってないので、実際のワークフローの中身については省略します。

### 必須要件
監査の都合上、いくつか必須要件がありました。

1. Slackにデプロイ通知をする（誰が、いつ、どのバージョンをデプロイしたかわかるように）
2. デプロイログを一定期間残す

### 移行方針
1. 移行完了が3ヶ月くらいはかかる見込みで、作業進めていく中でGitHub ActionsやAWSに新しい方法とかサービス出てるかもしれないが、取り入れずに一旦今の時点に揃えることする（よりよくするのはその後）
2. すでにAWS CodeBuild・AWS CodeDeployを使っているものは2つくらいだったので一旦無視する

### 利用した公式アクション
- [actions/cache](https://github.com/actions/cache)
- [actions/checkout](https://github.com/actions/checkout)
- [actions/setup-java](https://github.com/actions/setup-java)
- [actions/setup-python](https://github.com/actions/setup-python)
- [aws-actions/amazon-ecr-login](https://github.com/aws-actions/amazon-ecr-login)
- [aws-actions/amazon-ecs-deploy-task-definition](https://github.com/aws-actions/amazon-ecs-deploy-task-definition)
- [aws-actions/amazon-ecs-render-task-definition](https://github.com/aws-actions/amazon-ecs-render-task-definition)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
- [codecov/codecov-action](https://github.com/codecov/codecov-action)

### 工夫点
#### 実行ログの永続化
一番重要な実行ログ残す要件を満たすために、独自でバッチを作りました。今はプライベートレポジトリの実行ログ保存期間は最大400日になっていますが、当時は最大90日だった（気がする）のでログを永続化する方法を考えました。（もし400日以上残す場合は必要そう）

GitHub Actions側の後処理も含めて全ジョブ終了後にログが保存されるため、ワークフローの中にログを保存するジョブを入れることができませんでした。\
そこで、GitHub Actionsのscheduleトリガを使って、「1. GitHub APIを叩いてログファイルを取得」「2. 1で取得したZIPファイルをS3にアップロード」を行う日次バッチを作りました。

複数レポジトリにワークフローを置くのは管理コストが高くなり嫌だったので、それ用にレポジトリを立てるようにしました。\
`gist:b1a9id/56b5e5834c7d9b99cadab8d0e89533cf?file=upload.yml`

#### EB CLIのインストール
AWS CLIはデフォルトで、 [インストールされている](https://github.com/aws-actions/configure-aws-credentials#usage) のですが、EB CLIはインストールが必要です。\
このように書けば、20秒ほどでインストールできます。
`gist:b1a9id/0e1f550f6ea24a71a49a6448c7125451?file=deploy.yml`

#### action用プライベートレポジトリ
GitHub Actionsでは、 [独自アクション](https://docs.github.com/ja/actions/creating-actions) を作成することができます。複雑な処理をしたいときに使うのがよいかと思います。\
GitHub Actionsの制限は次の通りなので、action用のプライベートレポジトリを作るには工夫が必要でした。
```
- 公開アクションは `uses: Organization名/Repository名` で指定
- 非公開アクションは実行するレポジトリ内に独自アクションを置き、 `uses: ./アクション配置パス` で指定
```

Slackにデプロイ通知する独自アクションを各レポジトリに置きたくはなかったので、独自アクション×別レポジトリのチェックアウトという方法でaction用プライベートレポジトリっぽいことを実現しました。
```
1. action用プライベートレポジトリの用意
2. アクションを作る（複数作ることを考えて、独自アクションごとにディレクトリ分けるのがおすすめ）
3. アクションを実行したいレポジトリで、1で作成したレポジトリをチェックアウト
4. 3でチェックアウトした独自アクションを実行
```

これは、アクションを実行したいレポジトリのワークフローに書いた例です。
`gist:b1a9id/0b39cb6e007e62d618be7f68743b9e45?file=custom-action.yml`

#### 入力値チェック
手動実行時の入力値は、プルダウンが使えないためワークフロー内で入力チェックを行うようにした。

これは、パラメータ `environment` の入力値がtest1でもtest2でもない時に失敗させる例です。
`gist:b1a9id/3b9b31a82b9c1cec7dbb171c596f81df?file=deploy.yml`  

#### 依存関係やビルドによる成果物をキャッシュする
公式の [actions/cache](https://github.com/actions/cache) を使えば簡単に実現できます。

#### jobなりstep単位でタイムアウト時間を設定する
jobのタイムアウト時間はデフォルトで360分なので設定しないと長時間実行し続けて無料枠をすぐ消費してしまいます。
