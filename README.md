# TODO API with NestJS

## 概要

REST原則を基に設計、作成したシンプルなToDoアプリのAPIです。
TODOタスクを作成、検索、更新、および削除することができます。

また、生成AIを利用して、入力した目標を基にタスクの提案を行うことができます。

## インストール方法

### 前提条件

- Node.js (バージョン20.14)
- yarn (1.22.22)
- docker

### 動作確認

1. リポジトリをクローン

   ```bash
   git clone https://github.com/Kosuke418/todo-list-api.git
   cd todo-api-nestjs
   ```

1. 必要なパッケージをインストール

   ```bash
   yarn install
   ```

1. 環境変数を設定。`.env.example`ファイルをコピーして`.env`ファイルを作成

   ```bash
   cp .env.example .env
   ```

1. DBの起動（この時点でdockerでもアプリが立ち上がるため、node, yarnをインストールしない場合は5000ポートで動作確認が可能）

   ```bash
   docker-compose up -d
   ```

1. DBの起動確認（phpmyadminを利用し、データベース内を確認）

   ```bash
   http://localhost:8888/
   ```

1. マイグレーション

   ```bash
   yarn migration:run
   ```

1. インストール

   ```bash
   yarn install
   ```

1. アプリケーションを起動

   ```bash
   yarn start:dev
   ```

1. 以下に接続し、"Hello World!"が表示されれば成功

   ```bash
   http://localhost:3000/api/health
   ```

## 使い方

### エンドポイント

- **POST api/signup**: ユーザの作成
- **POST api/signin**: ユーザの認証（JWTを取得）
- **GET api/tasks**: タスクの一覧を取得
- **GET api/tasks/:id**: 指定したIDのタスクを取得
- **POST api/tasks**: 新しいタスクを作成
- **PATCH api/tasks**: 指定したIDのタスクを更新
- **DELETE api/tasks/:id**: 指定したIDのタスクを削除
- **POST api/tasks/suggest**: 指定した目標を基にタスクを提案（ChatGPTを利用）

### サンプルリクエスト

ユーザの作成後、ユーザの認証のAPIを実行することでJWTを取得

取得したJWTをヘッダーのAuthorizationに指定することでユーザごとのタスク制御を行える

#### GET api/tasks

```bash
curl -X GET http://localhost:3000/api/tasks -H "Authorization: Bearer xxx"
```

#### POST api/tasks

```bash
curl -X POST http://localhost:3000/api/tasks -H "Authorization: Bearer xxx" -H "Content-Type: application/json" -d '{
  "title": "新しいToDo",
  "common": "これは新しいToDo項目です"
}'
```

### ドキュメント

API仕様書、DB仕様書（masterブランチpush時にGithubActionにて自動生成）

https://kosuke418.github.io/todo-list-api/

## コマンド

### Installation

```bash
$ yarn install
```

### Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Databese

```bash
# create db
$ docker-compose up -d

# db migration
$ yarn migration:generate src/db/migrations/${filename}

# db migration
$ yarn migration:run

# db revert
$ yarn migration:revert
```

## 参考資料

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Swagger Documentation](https://swagger.io/docs/)
