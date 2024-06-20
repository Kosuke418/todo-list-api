## 全体図

![全体図](https://github.com/Kosuke418/todo-list-api/assets/32722339/e0edd279-f8b4-4ea0-a972-62e5536828ee)

## 認証シークエンス図

![認証シークエンス図](https://github.com/Kosuke418/todo-list-api/assets/32722339/7d24bdec-c9cc-4b36-96f6-99d8d116f64e)

## ディレクトリ構成

```
│  .env
│  .env.sample
│  .env.test
│  .eslintrc.js
│  .gitignore
│  .prettierrc
│  ARCHITECTURE.md
│  docker-compose.yml
│  Dockerfile
│  nest-cli.json
│  package.json
│  README.md
│  tsconfig.build.json
│  tsconfig.json
│  yarn.lock
│  
├─.github
│  └─workflows
│          deploy-to-aws.yml
│          deploy-to-github-pages.yml
│          test.yml
│
├─api
│      .gitkeep
│
├─docs
│  │  .gitkeep
│  │
│  └─adr
│          001_xxxxxx.md
│
├─src
│  │  app.controller.ts
│  │  app.module.ts
│  │  main.ts
│  │
│  ├─auth
│  │  │  auth.controller.ts
│  │  │  auth.module.ts
│  │  │  auth.service.spec.ts
│  │  │  auth.service.ts
│  │  │
│  │  ├─decorators
│  │  │      get-user.decorator.ts
│  │  │
│  │  ├─dto
│  │  │      access-token.dto.ts
│  │  │      create-user.dto.ts
│  │  │      credentials.dto.ts
│  │  │      user-response.dto.ts
│  │  │
│  │  ├─guards
│  │  │      jwt-auth.guard.ts
│  │  │
│  │  └─strategies
│  │          jwt.strategy.spec.ts
│  │          jwt.strategy.ts
│  │
│  ├─common
│  │  ├─decorators
│  │  │      undefinedable.decorator.ts
│  │  │      valid-fields.decorator.ts
│  │  │
│  │  ├─dto
│  │  │      response.dto.ts
│  │  │
│  │  ├─middlewares
│  │  │      content-type.middleware.ts
│  │  │
│  │  └─utils
│  │          convert-fields-to-select.ts
│  │
│  ├─db
│  │  │  data-source.ts
│  │  │  database.config.ts
│  │  │
│  │  ├─entities
│  │  │      task.entity.ts
│  │  │      user.entity.ts
│  │  │
│  │  └─migrations
│  │          1718642357082-init.ts
│  │
│  ├─externals
│  │  │  chatgpt.service.ts
│  │  │  externals.module.ts
│  │  │
│  │  └─types
│  │          chat-message.interface.ts
│  │
│  └─tasks
│      │  tasks.controller.ts
│      │  tasks.module.ts
│      │  tasks.service.spec.ts
│      │  tasks.service.ts
│      │
│      ├─dto
│      │      create-task.dto.ts
│      │      find-task-query.dto.ts
│      │      findall-task-query.dto.ts
│      │      suggest-task-response.dto.ts
│      │      suggest-task.dto.ts
│      │      task-response.dto.ts
│      │      update-task.dto.ts
│      │
│      └─types
│              task-status.enum.ts
│
└─test
    │  app.e2e-spec.ts
    │  auth.e2e-spec.ts
    │  jest-e2e.json
    │  tasks.e2e-spec.ts
    │
    └─mock
            jwt.mock.ts

```

## モジュールの概要

NestJSのモジュールシステムを活用して、機能ごとに分離されたモジュールを設計。

レイヤードアーキテクチャとして、プレゼンテーション層（コントローラー）、アプリケーション層（サービス）に分割。NestJsの基本構造に乗っ取り、コントローラーでルーティング、サービスではビジネスロジックを担当する。

### Auth

ユーザの登録および認証を担当。認証・認可にはJWTを使用。

### Tasks

TODOタスクの生成、検索、更新、削除を担当。AuthModuleの認証機能を利用し、ユーザごとのタスクの制御を行う。

### common

共通処理を担当。middlewareや共通のdecoratorなど。

### db

データベース周りの処理を担当。Entity、マイグレーション関連、接続の設定など。

### externals

外部サービスとの連携を担当。ChatGPTなど。

## 自動テスト

masterに対するPR時にGithubActionにて自動テストを行うように実装。ソースコードの統合時に自動で正常に動作することを検証し、品質担保を行う。

DBを開発用、本番用とは分け、テスト時にはsqliteを使用し、自動テストの時間を軽減。

## 自動ドキュメント生成（Swagger、SchemaSpy）

ドキュメント生成にあたって、Swagger、SchemaSpyを導入。

コントローラーやDTOに専用アノテーションを付与、マイグレーションファイルを生成することで、API・DB仕様のドキュメント化を行える。

masterへマージする際にGithubActionにてこれらのドキュメントを自動で生成するようにワークフローを実装。生成したドキュメントはGithubPagesへ自動デプロイされる。これにより、ドキュメント修正のコストを軽減。

https://kosuke418.github.io/todo-list-api/

## AWSへの自動デプロイ機能

ECSのFargateへのデプロイ機能を実装。

masterブランチへプッシュ時に、GithubActionからECRにイメージをプッシュ→ECSにデプロイを行う。

現状AWS上のDBは未実装のため、デプロイ後タスクが落ちる。

## ミドルウェア周り

### ContentTypeMiddleware

POSTの際のcontentTypeをapplication/jsonに制限。
予期しないデータ形式のリクエストからの攻撃を防ぎ、APIのセキュリティを向上。

## 今後の展望

- タスクのカテゴリと期日の追加
- AWS環境でのDB構築とマイグレーションの仕組み
- ログの設計と実装
- DBのユーザ追加
- テストデータ投入スクリプト
- リファクタリング
