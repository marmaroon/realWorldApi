import {MigrationInterface, QueryRunner} from "typeorm";

export class FixNamingOfDB1690205039481 implements MigrationInterface {
    name = 'FixNamingOfDB1690205039481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "taglist" TO "tagList"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "tagList" TO "taglist"`);
    }

}
