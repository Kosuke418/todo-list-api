## 全体図

![全体図](https://github.com/Kosuke418/todo-list-api/assets/32722339/e0edd279-f8b4-4ea0-a972-62e5536828ee)

## 認証シークエンス図

![認証シークエンス図](https://github.com/Kosuke418/todo-list-api/assets/32722339/7d24bdec-c9cc-4b36-96f6-99d8d116f64e)

## インフラ構成図

![インフラ構成図](https://github.com/Kosuke418/todo-list-api/assets/32722339/7cfb9f65-66bc-4f05-96f3-2cc0eeda2c46)

## モジュールの概要

NestJSのモジュールシステムを活用して、機能ごとに分離されたモジュールを設計。

レイヤードアーキテクチャとして、プレゼンテーション層（コントローラー）、アプリケーション層（サービス）に分割。NestJsの基本構造に乗っ取り、コントローラーでルーティング、サービスではビジネスロジックを担当する。

- **Auth**：ユーザの登録および認証を担当。認証・認可にはJWTを使用。
- **Tasks**：TODOタスクの生成、検索、更新、削除を担当。AuthModuleの認証機能を利用し、ユーザごとのタスクの制御を行う。
- **common**：共通処理を担当。middlewareや共通のdecoratorなど。
- **db**：データベース周りの処理を担当。Entity、マイグレーション関連、接続の設定など。
- **externals**：外部サービスとの連携を担当。ChatGPTなど。

## CI/CD周り

### ワークフローの概要

ワークフローで使用する環境変数周りはGithubSecretにより管理。

- **ci.yml**: テスト、プログラムチェックを行う（masterへのPR作成時）
- **deploy-to-aws.yml**: AWS ECSにデプロイを行う（GithubAction手動実行時）
- **deploy-to-pages.yml**: Github pagesにドキュメントのデプロイを行う（masterへのプッシュ時）
- **delopy-migration-file.yml**: AWS ECRにmigration用のimageのデプロイを行う（GithubAction手動実行時）

### 自動ドキュメント生成（Swagger、SchemaSpy）

ドキュメント生成にあたって、Swagger、SchemaSpyを導入。

コントローラーやDTOに専用アノテーションを付与、マイグレーションファイルを生成することで、API・DB仕様のドキュメント化を行える。

masterへマージする際にGithubActionにてこれらのドキュメントを自動で生成するようにワークフローを実装。生成したドキュメントはGithubPagesへ自動デプロイされる。これにより、ドキュメント修正のコストを軽減。

https://kosuke418.github.io/todo-list-api/

### AWSへのデプロイ

ECSのFargateへのデプロイ機能を実装。

GithubActionより、ECRにimageをプッシュ→ECSにデプロイを行う仕組みを実装。
Dockerfileではマルチステージビルドを利用し、imageファイルの軽量化を行った。

GithubActionより、マイグレーション用のimageをECRへプッシュを行う仕組みを実装。マイグレーションはECSのタスクを起動することで行う。

### 自動テストとプログラムチェック（Lint）

masterに対するPR時にGithubActionにて自動テストとプログラムチェックを行うように実装。ソースコードの統合時にテストおよびコードの記述を自動検証し、品質担保を行う。

DBを開発用、本番用とは分け、テスト時にはsqliteを使用し、自動テストの時間を軽減。

## セキュリティ

- JWTによる認証・認可

  JWTによるトークンをリクエストヘッダーに含めて、サーバー側で検証を行う。ユーザごとにデータを制御し、予期しないデータの取得を防ぐ。

- ContentTypeMiddleware

  POST、PATCHの際のcontentTypeをapplication/jsonに制限。
  予期しないデータ形式のリクエストによる攻撃などを防ぐ。

- NoCacheInterceptor

  GET以外でのcacheを制限。主に認証周りにおいてキャッシュによる予期しないデータの取得を防ぐ。

## 今後の展望

- ログの設計と実装
- マイグレーション用imageの軽量化
- カテゴリと期日による検索の絞り込み
- インメモリキャッシュの導入
- API Gateway+lambdaへの変更の検討
- テスト拡充
- huskyの導入
- DBのユーザ追加
- テストデータ投入スクリプト
- リファクタリング
