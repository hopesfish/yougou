ALTER TABLE `yougouwx`.`wex_activity` 
ADD COLUMN `type` TINYINT(1) NOT NULL DEFAULT 0 AFTER `archived`;

ALTER TABLE `yougouwx`.`wex_activity` 
ADD COLUMN `reply` VARCHAR(500) NULL AFTER `type`;