<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Databese

```bash
# create db
$ docker-compose up -d

# db migration
$ migration:generate src/db/migrations/${filename}

# db migration
$ yarn migration:run

# db revert
$ migration:revert
```

## 動作確認方法

ローカル環境にnode、yarnのインストールをしてください

下記バージョンで動作確認済み

```
yarn： v1.22.22
node： v22.2.0
```

下記の順番でコマンドを実行してください

```bash
# 1 create .env
$ cp .env.sample .env

# 2 create db
$ docker-compose up -d

# 3 db migration
$ yarn migration:run

# 4 install
$ yarn install

# 5 start
$ yarn start:dev
```

以下に接続し、"Hello World!"が表示されれば成功

http://localhost:3000/api/health

## ドキュメント

API仕様書、DB仕様書（masterブランチpush時にGithubActionにて自動生成）

https://kosuke418.github.io/todo-list-api/

## やったこと

- 検索、登録、更新、削除のAPIの実装
- DB仕様書の作成（GithubActionにて自動生成）
- API仕様書の作成（GithubActionにて自動生成）
- ユーザごとでタスクを制御し、認証/認可を行える
- PR時の自動テスト
- テストコードの実装

## やりたいこと

- アーキテクチャドキュメントの拡充
- AWSへのデプロイ機能（サーバーレス）
- 本番環境でのマイグレーションの仕組み
- タスクのカテゴリと期日の追加
- ChatGPTを利用してTODOを提案するAPI
- ログの設計と実装
- DBのユーザ追加
- テストデータ投入スクリプト
- リファクタリング

## License

Nest is [MIT licensed](LICENSE).
