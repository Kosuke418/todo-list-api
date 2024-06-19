import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1718790600049 implements MigrationInterface {
    name = 'Init1718790600049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL COMMENT 'タスクid', \`title\` varchar(255) NOT NULL COMMENT 'タイトル', \`content\` varchar(255) NULL COMMENT '内容', \`status\` varchar(255) NOT NULL COMMENT 'ステータス', \`user_id\` varchar(255) NOT NULL COMMENT 'ユーザid', \`created_at\` datetime(6) NOT NULL COMMENT '作成日時' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="タスクテーブル"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`tasks\``);
    }

}
