CREATE DATABASE lfgmapidb;

USE lfgmapidb;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `password` VARCHAR(200) COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`)
 ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;

USE lfgmapidb;

 CREATE TABLE IF NOT EXISTS `tasks` (
    `id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `description` VARCHAR(200) COLLATE utf8_unicode_ci NOT NULL,
    `status` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    `dueDate` VARCHAR(200) COLLATE utf8_unicode_ci NOT NULL,
    `emailUser` VARCHAR(100) COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8;

INSERT INTO users(email, password) VALUES('prueba@prueba.com', '123')

DESCRIBE users;
DESCRIBE tasks;