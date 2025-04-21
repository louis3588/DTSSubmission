-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema taskTracker
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `taskTracker` ;

-- -----------------------------------------------------
-- Schema taskTracker
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `taskTracker` DEFAULT CHARACTER SET utf8 ;
USE `taskTracker` ;

-- -----------------------------------------------------
-- Table `taskTracker`.`task`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `taskTracker`.`task` ;

CREATE TABLE IF NOT EXISTS `taskTracker`.`task` (
  `id` INT NOT NULL,
  `title` VARCHAR(140) NOT NULL,
  `description` VARCHAR(560) NULL,
  `status` VARCHAR(45) NOT NULL,
  `dueDateTime` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `taskId_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
