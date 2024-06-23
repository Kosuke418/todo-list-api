import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskFields1719110010017 implements MigrationInterface {
    name = 'AddTaskFields1719110010017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`due_date\` datetime NULL COMMENT '期日'`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`category\` varchar(255) NULL COMMENT 'カテゴリ'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`category\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`due_date\``);
    }

}
