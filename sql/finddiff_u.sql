ALTER TABLE `yougouwx`.`wex_finddiff` 
CHANGE COLUMN `open_id` `open_id` VARCHAR(200) NULL COMMENT '公众号OpenID' ,
ADD COLUMN `union_id` VARCHAR(50) NOT NULL COMMENT '唯一标识' AFTER `archived`;
