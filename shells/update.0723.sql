ALTER TABLE `yougouwx`.`wex_activity` 
DROP INDEX `code_UNIQUE` ,
ADD UNIQUE INDEX `code_UNIQUE` (`code` ASC);

ALTER TABLE `yougouwx`.`wex_coupon`  ADD INDEX act_idx ( `activity_id` ) ;
ALTER TABLE `yougouwx`.`wex_coupon`  ADD INDEX wx_idx ( `open_id` ) ;