ALTER TABLE `yougouwx`.`wex_dream_vote` 
ADD COLUMN `headimgurl` VARCHAR(200) NULL AFTER `archived`,
ADD COLUMN `nickname` VARCHAR(200) NULL AFTER `headimgurl`;