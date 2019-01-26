---
template: post
title: 初めてのTech DayでConcourse CIに入門した
slug: /posts/tech-day-concourse-ci/
draft: false
date: '2019-01-11T18:46:04.121Z'
description: 初めてのTech DayでConcourse CIに入門した
category: CI/CD
tags:
  - Concourse
---
コイニーのバックエンドチームでTech Dayを初開催しました！
Tech Dayとは、<b>「日々のプロジェクトにリソースを取られて、技術獲得やチャレンジができず知的好奇心を満たせていない」</b>と感じたリーダーが（勝手に）企画してくれたとてもありがたい日です。2週ごとに1日くらいのペースでやっていくつもりです。
題材は、自チームや自身のメリットに繋がることであれば何でもよいです。（他チームの為に便利ツールを作成するとか運用が発生するようなものはやらない）

私は題材に「Concourse CI入門」を選びました。チュートリアルを試したレベルですが、やったことを書きます。
この題材にした理由は2つあります。

1. 数年前から気になっていて、当時の同僚（とても尊敬している人）がかなり推していたから
2. 会社でJenkinsを使っているけど、時代的にどうだろうと思ったから。

- - -

### Concourse CI入門

[チュートリアル](https://concoursetutorial-ja.cfapps.io/)をやりました。

#### Concourseをローカルにデプロイ

1. Docker Composeのインストール
2. 任意のディレクトリで次のコマンドを実行。Councourseがデプロイされます。


```
$ wget https://raw.githubusercontent.com/starkandwayne/concourse-tutorial/master/docker-compose.yml
$ docker-compose up -d
```

#### fly CLIのセットアップ

flyコマンドについては、[こちら](https://concourse-ci.org/fly.html)

##### fly CLIをダウンロード

<http://127.0.0.1:8080/>にアクセスして、OSのロゴをクリックするとfly CLIのバイナリが落ちてきます。（今回はMacで話を進めます）

![1](/media/1.png "1")

ダウンロードしたら次のコマンドを実行します。

```
$ sudo mv ~/Downloads/fly /usr/local/bin
$ sudo chmod 0755 /usr/local/bin/fly
```

#### ターゲットの指定

fly CLIは、<b>declaring absolutely everything you do to get absolutely the same result every time</b>の精神に基づいており、flyコマンドを実行する度にターゲットAPIを指定する必要があります。

ターゲットエイリアスを作成

```
// tutorialという名前でエイリアスを作成
$ fly --target tutorial login --concourse-url http://127.0.0.1:8080
logging in to team 'main'

navigate to the following URL in your browser:

  http://127.0.0.1:8080/sky/login?redirect_uri=http://127.0.0.1:54711/auth/callback

or enter token manually:
```

メッセージにしたがって<http://127.0.0.1:8080/sky/login?redirect_uri=http://127.0.0.1:54711/auth/callback>にアクセスすると、ログイン画面が表示されます。
docker-compose.ymlの`services.concourse.environment.CONCOURSE_ADD_LOCAL_USER`に設定されている。username:admin、password:adminでログインできます。
コマンドでもログインできます。

```
$ fly --target tutorial login --concourse-url http://127.0.0.1:8080 -u admin -p admin
logging in to team 'main'

target saved
```

ターゲットとして指定されているConcourseと同じバージョンのflyコマンドにアップグレード 

```
$ fly --target tutorial sync
version 4.2.1 already matches; skipping
```

ターゲットの確認

```
$ cat ~/.flyrc
targets:
  tutorial:
    api: http://127.0.0.1:8080
    team: main
    token:
      type: Bearer
      value: eyJhbGciOiJSUzI1NiIsImtpZCI6IiIsInR5cCI6IkpXVCJ9.eyJjc3JmIjoiNTEzZGIyZTBiMGVkYTEzZGU5MDk5Mzk0YjJkMWNiMTViZDQ2ZTJjZTgzZjRhOTFjYjRmMmQzZjY4ZmFmOWE5YyIsImVtYWlsIjoiYWRtaW4iLCJleHAiOjE1NDcyNzcyMzUsImlzX2FkbWluIjp0cnVlLCJuYW1lIjoiIiwic3ViIjoiQ2dWaFpHMXBiaElGYkc5allXdyIsInRlYW1zIjpbIm1haW4iXSwidXNlcl9pZCI6ImFkbWluIiwidXNlcl9uYW1lIjoiYWRtaW4ifQ.n-3zISYO7poQamnjJ-yYP-ChX3RHROTWkwng3GnHm3d8fefxoO8p-Bxod2we-KQWEfE8w27JuyNejOI53dSK7rORi1bu8xUE7WbLkhZTA1TlvTzPj8sEXT-KJ_PfCBgyhs_vL91LertLkXVA0Orre6aRGb-kHd-tbdqF1OaMFGYKZbJ5oZr0hMtvunQrpm3oIbeHEX0Edvwi2tYDem4ccwqrhoxSEYVouXuBthdq59LeBw5INsM92UIBPQNkZqkSZyQCJqaSzr3xeGDiDxWl5uxIfeAFHfOUSuqefTE1bhWS3dolRDWr5SDWi_oIuW1fCMmsY8bWMrWGnCatI4tXuQ
```

エイリアスの作成をしたので、flyコマンド実行時に `fly --target tutorial` とうつことでこのConcourse APIをターゲットにできます。

#### Taskを実行する

##### task\_hello\_world.ymlの実行

任意のディレクトリで次のコマンドを実行し、concourse-tutolialをクローンしてtask_hello_world.ymlを実行します。これは、`echo hello world`と出力するだけの簡単タスクです。

```
$ git clone https://github.com/starkandwayne/concourse-tutorial
$ cd concourse-tutorial/tutorials/basic/task-hello-world
$ fly -t tutorial execute -c task_hello_world.yml
```

タスクが完了すると、以下のように出力されます。`echo hello world` が呼ばれていることがわかります。

```
executing build 1 at http://127.0.0.1:8080/builds/1
initializing
running echo hello world
hello world
succeeded
```

<http://127.0.0.1:8080/builds/1>にアクセスするとWebUIで実行結果を確認できます。

![2](/media/2.png "2")

##### task\_ubuntu\_uname.ymlの実行

```
$ fly -t tutorial execute -c task_ubuntu_uname.yml
executing build 4 at http://127.0.0.1:8080/builds/4
initializing
running uname -a
Linux 303a03ea-bb52-406c-6da3-93235f258a59 4.9.125-linuxkit #1 SMP Fri Sep 7 08:20:28 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
succeeded
```

これも同様に、<http://127.0.0.1:8080/builds/4>にアクセスするとWebUIで実行結果を確認できます。

![3](/media/3.png "3")

今回はとりあえずここまでです。
