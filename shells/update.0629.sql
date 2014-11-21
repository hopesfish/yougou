ALTER TABLE `yougouwx`.`wex_activity` 
ADD COLUMN `restrict_days` INT NOT NULL DEFAULT 0 AFTER `end_reply`;
ALTER TABLE `yougouwx`.`wex_activity` 
ADD COLUMN `restrict_days_reply` TEXT NULL AFTER `restrict_days`;