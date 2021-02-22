---
template: post
title: Bitbucket pipelineのドキュメント読んだ
slug: /posts/bitbucket-pipelines
draft: true
date: 2021-02-22T16:18:11.757Z
description: 2020年10月にBitbucketのサーバーライセンスの販売終了が発表されました。個人でいただいている仕事の方でBitbucket
  Serverを利用しており、BitBucket Cloudへの移行が必要になりました。Bitbucket
  CloudのデフォルトCI/CDであるBitbucket Pipelinesを利用するので、ドキュメントを読んでまとめます。
category: CICD
tags:
  - BitbucketPipelines
---
2020年10月に[Bitbucketのサーバーライセンスの販売終了](https://www.atlassian.com/ja/blog/journey-to-cloud)が発表されました。個人でいただいている仕事の方でBitbucket Serverを利用しており、BitBucket Cloudへの移行が必要になりました。\
Bitbucket CloudのデフォルトCI/CDであるBitbucket Pipelinesを利用するので、[ドキュメント](https://support.atlassian.com/bitbucket-cloud/docs/build-test-and-deploy-with-pipelines/)を読んでまとめます。\

# Bitbucket Pipelinesとは
Bitbucket Pipelinesとは、Bitbucket内で利用できるCI/CDサービス。ビルド、テスト、デプロイなどを自動的に行うことできる。基本的にはクラウド上に自分専用のコンテナ環境を作成する。\
パイプラインは、bitbucket-pipelinens.ymlのファイルに定義して、レポジトリ直下に配置する。

# パイプラインの設定
[Configure your pipeline](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-pipeline/)

基本的に、ビルドやデプロイするためのスクリプトを書いたり、ビルド時間短縮のためのキャッシュの設定を書いたりする。ステップごとに異なるイメージを利用することができる。\
パイプラインの設定を書くために次の注意点がある。
1. 最低１ステップは必要で、ステップの中に最低1スクリプト必要
2. どのステップも利用できるメモリは4GB
3. 1パイプラインあたり最大100ステップまで
4. ステップ毎に別のDockerコンテナで実行される。

## セクションについて
- default
  - 全ブランチのpush毎に実行される処理を書くセクション。
- branches
  - 指定したブランチで実行される処理を書くセクション。
- tags
  - 指定したtagで実行される処理を書くセクション。
- bookmarks
  - 指定したブックマークで実行される処理を書くセクション
- pull requests
  - レポジトリ内のプルリクエストが初期化されるときに実行される処理を書くセクション。
- custom
  - 手動実行や日時実行する処理を書くセクション。

## グローバルに設定できるオプション
- variables
  - customパイプラインのみ定義でできる。パイプラインがローンチされる時に使われる変数。
- parallel
  - 同時実行させる。
- step
  - ビルド実行単位を定義する。
  - 生成されたartifactsは14日間保存される。
- name
  - ステップ名
- images
  - ビルドするために使われるDockerコンテナ。
    - デフォルトイメージやパブリック、プライベートなDockerイメージを利用できる。
    - globalまたはステップ毎にイメージを定義できる。
- trigger
  - ステップは自動実行か手動実行か指定できる。triggerのデフォルトは自動。
  - 第１ステップは手動にはできない
- deployment
  - deploymentステップのための環境をセットする。
　- 利用できるあたいは、test, staging, production
- size
  - sizeオプションを書いたステップは、2倍のメモリを利用できる。
- script
  - 実行コマンドのリスト。
  - スクリプトが多い場合は、スクリプトファイルに書いて実行させることを推奨。
- pipe
  - 用意されているインテグレーションを利用できる。[インテグレーションリスト](https://bitbucket.org/product/features/pipelines/integrations)から選択して利用する。
- after-script
  - ステップが成功か失敗したときに実行される。クリーンアップコマンドや、テストカバレッジ、通知などに役出つ。
  - `BITBUCKET_EXIT_CODE`を使って終了コードを取得できる。
- artifacts
  - レポートやJARなどのステップによって生成されるファイルを定義する。
- caches
  - ライブラリ等をキャッシュする。

## YAML anchors
[YAML anchors](https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/)

bitbucket-pipelines.yml ファイルに繰り返し利用したいステップがある場合、YAML anchorsを利用するのがよい。

### Anchors and aliases
'&'で設定のまとまりを定義して、'*'で&で定義した設定のまとまりを利用できる。

## ビルド環境としてDockerイメージを利用
[Use Docker images as build environments](https://support.atlassian.com/bitbucket-cloud/docs/use-docker-images-as-build-environments/)

DockerコンテナでBitbucket Pipelinesのビルドが実行される。Docker Hub, AWS, GCP, Azure, self-hosted registriesにあるパブリック、プライベートイメージを利用できる。

# Deployments
## Set up and monitor deployments
[Set up and monitor deployments](https://support.atlassian.com/bitbucket-cloud/docs/set-up-and-monitor-deployments/)

### デプロイの設定
1.Bitbucketにデプロイ環境について設定する。
- 環境名
- 環境の種類
- 環境変数

2.環境を定義する
パイプラインを有効にすると、デフォルトで3環境(Test, Staging, Production)が用意される。
デプロイの変数は、チームとレポジトリの変数を上書きする。

3.デプロイステップを定義する

bitbucket-pipelines.ymlのstepにdeploymentを追加する。deploymentには、環境名を含む必要がある。

```yml
- step:
        name: Deploy to production
        deployment: production-east
        script:
          - python deployscript.py prod
```

コミットメッセージにissue番号を書けば、Jiraとの連携も可能。

### デプロイのロールバック
デプロイにした場合、直近の成功したデプロイバージョンに戻すことができる。

1. Redeployボタンを有効にする
2. 環境を選択して、Redeployボタンを押下する

# Pipeline triggers
## 手動実行
bitbucket-pipelines.ymlに`trigger: manual`を追加することで、手動ステップを設定できる。最初のステップに手動トリガを設定することはできない。もし、手動実行だけのパイプラインを設定したい場合は、`custom`セクションの中に書く必要がある。

`variable`セクションに手動実行時に渡したい変数を設定することができる。

## スケジューリング
指定した日時に実行させることができる。レポジトリの設定から日時を設定することができる。

## ブランチ
ブランチ毎のpushをトリガにしてパイプラインを実行させることができる。

## Keywords
- default
  - 全ブランチの全push毎に実行される
- tags
  - 指定したタグで実行される。
- pull-request
  - プルリクエスト初期化時に実行される。defualtで定義されたパイプラインも実行されるため、２パイプラインが並行実行する。
- custom
  - 手動orスケジューリングトリガを設定する。
- variables
  - [Custom pipelines only]パイプライン実行時に渡す変数を定義する。
- bookmarks
  - ブックマーク

# Variables and secrets
[Variables and secrets](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/)

ビルドコンテナ内で利用する環境変数を設定できる。いくつかデフォルトで用意されており自分で設定することもできる。

自分で設定する場合の制約は次の通り。
```txt
- 利用可能な文字は、ASCII文字、数字、アンダースコア
- 大文字小文字は区別する
- 数字からはじめることはできない
- シェルによって定義される変数を利用するべきでない
```

設定できる変数は、ワークスペース変数、レポジトリ変数、デプロイメント変数がある。セキュアに変数を設定すると、ログに値が表示されない。

## Bitbucket Pipelines内でSSHキーを利用する
レポジトリのPipelinesのSSH keysで設定できる。

# Caches
[Caches](https://support.atlassian.com/bitbucket-cloud/docs/cache-dependencies/)

Bitbucket　Pipelinesはサードパーティライブラリなどの外部の依存関係やディレクトリをキャッシュすることができる。最初のパイプライン実行時にキャッシュしてそれ以降はキャッシュを使う。

# Databases and service containers
[Databases and service containers](https://support.atlassian.com/bitbucket-cloud/docs/databases-and-service-containers/)

Bitbucket　Pipelinesは、ビルドパイプラインから複数のテストなどで利用するためのDockerコンテナを実行することができる。（DBやRedisなど）

# Use pipes in Bitbucket Pipelines
[Use pipes in Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/use-pipes-in-bitbucket-pipelines/)

Pipesは、パイプラインを設定するためのシンプルな方法を提供する。サードパーティのツールと動かしたい時に特に強力である。

# Integrations
[Integrations](https://support.atlassian.com/bitbucket-cloud/docs/integrations/)

「Jira - Pipelines」、「Slack - Pipelines」などの連携について

# Testing
[Testing](https://support.atlassian.com/bitbucket-cloud/docs/testing/)

## Test reporting in Pipelines
ビルドステップの中でテストレポートを生成しているなら、pipelinesは自動的に探してWeb上で見れるようにする。ただし、xUnitのレポートに限る。