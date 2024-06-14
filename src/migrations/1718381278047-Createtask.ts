import {MigrationInterface, QueryRunner} from "typeorm";

export class Createtask1718381278047 implements MigrationInterface {
    name = 'Createtask1718381278047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`createdAt\` varchar(255) NOT NULL, \`updatedAt\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`task\``);
    }

}
