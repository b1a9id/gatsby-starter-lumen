---
template: post
title: Spring Security 5.4(Spring Boot 2.4)から不正なURLでのリクエストに任意のステータスコードを返せるようになった
slug: /posts/spring-security-invalid-url-request
draft: false
date: 2020-12-26T08:13:20.424Z
description: >-
  Spring Security 5.4(Spring Boot
  2.4)から不正なURLでのリクエストに対して、任意のステータスコードを返せるようになりました。

  RequestRejectedHandlerインターフェースが追加されて、RequestRejectedExceptionをハンドリングできるようになりました。単に任意のステータスコードを返せばよいだけの場合は、HttpStatusRequestRejectedHandlerクラスをBean登録してください。（デフォルトだと400を返します）  
category: Security
tags:
  - Spring Security
---
Spring Security 5.4(Spring Boot 2.4)から不正なURLでのリクエストに対して、任意のステータスコードを返せるようになりました。とっても嬉しい！！！

## Spring SecurityのHttpFirewall
[公式ドキュメント#HttpFirewall](https://docs.spring.io/spring-security/site/docs/5.4.1/reference/html5/#servlet-httpfirewall) に詳しく書いてあるのですが、Spring Securityでは `;`や`\`が含まれている不正なURLを弾いてくれるHttpFirewallインターフェースがあります（デフォルトでStrictHttpFirewallクラスが使われる）。

不正なURLだと、`RequestRejectedException`が投げられます（[ソースコード](https://github.com/spring-projects/spring-security/blob/5.4.x/web/src/main/java/org/springframework/security/web/firewall/StrictHttpFirewall.java#L442-L476)）。

```
2020-12-26 16:12:54.917 ERROR --- Servlet.service() for servlet [dispatcherServlet] in context with path [/] threw exception
org.springframework.security.web.firewall.RequestRejectedException: The request was rejected because the URL contained a potentially malicious String ";"
```

## Spring Security 5.3.x(Spring Boot 2.3.x)まで
RequestRejectedExceptionのExceptionHandlerがなくて、ステータスコード500が返されていました。（なんでエラー扱いされないといけないんだと何回思ったことか...）

## Spring Security 5.4(Spring Boot 2.4)
RequestRejectedHandlerインターフェースが追加されて、RequestRejectedExceptionをハンドリングできるようになりました（[プルリク](https://github.com/spring-projects/spring-security/pull/7052)）。

単に任意のステータスコードを返せばよいだけの場合は、HttpStatusRequestRejectedHandlerクラスをBean登録してください。（デフォルトだと400を返します）  

`gist:b1a9id/4c6b4991f2bae1d5b90f390ac5eccb0c?file=WebSecurityConfig.java`　　

404を返したいんだけど...というときは、コンストラクタで渡してください。
`gist:b1a9id/b847ee813ca22c703f7c58a457e0a6dc?file=WebSecurityConfig.java`　　

