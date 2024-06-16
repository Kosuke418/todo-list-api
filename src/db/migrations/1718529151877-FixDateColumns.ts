import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDateColumns1718529151877 implements MigrationInterface {
    name = 'FixDateColumns1718529151877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updatedAt\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdAt\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`updatedAt\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`createdAt\` varchar(255) NOT NULL`);
    }

}
