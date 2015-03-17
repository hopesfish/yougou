ALTER TABLE `yougouwx`.`wex_finddiff` 
CHANGE COLUMN `open_id` `open_id` VARCHAR(200) NULL COMMENT '公众号OpenID' ,
ADD COLUMN `union_id` VARCHAR(50) NOT NULL COMMENT '唯一标识' AFTER `archived`;

1.  排名前10名的优粉可获赠由优购时尚商城发出的300元礼品卡一张；
2.  排名第11名至第30名的优粉可获赠由优购时尚商城发出的200元礼品卡一张；
3.  排名第31名至第50名的优粉可获赠由优购时尚商城发出的100元礼品卡一张；
4.  排名第51名至第200名的优粉可获赠由优购时尚商城提供的50元礼品卡一张/50元优惠券一张/价值xxx元的xx品牌xx一件/价值xxx元的xx品牌xx一件（4种礼品随机抽取一种送出）。
