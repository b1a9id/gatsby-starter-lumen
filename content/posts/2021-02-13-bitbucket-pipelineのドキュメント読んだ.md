---
template: post
title: Bitbucket pipelineのドキュメント読んだ
slug: /posts/bitbucket-pipelines
draft: true
date: 2021-02-13T05:51:30.196Z
description: 詳細
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


