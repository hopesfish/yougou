CREATE TABLE `wex_dream` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `nickname` varchar(200) DEFAULT NULL COMMENT '昵称',
  `headimgurl` varchar(200) DEFAULT NULL COMMENT '头像',
  `open_id` varchar(200) NOT NULL COMMENT '公众号OpenID',
  `sub_open_id` varchar(200) DEFAULT NULL COMMENT '服务号OpenID',
  `bonus` int(10) NOT NULL DEFAULT 0 COMMENT '积分',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_dream` 
ADD INDEX `openid_idx` (`open_id` ASC);

ALTER TABLE `yougouwx`.`wex_dream` 
ADD INDEX `sub_open_id_idx` (`sub_open_id` ASC);

ALTER TABLE `yougouwx`.`wex_dream` 
ADD INDEX `bonus` (`bonus` DESC);


CREATE TABLE `wex_dream_vote` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `dream_id` varchar(36) NOT NULL COMMENT '梦想标示',
  `sub_open_id` varchar(200) NOT NULL COMMENT '服务号OpenID',
  `bonus` int(10) NOT NULL DEFAULT 0 COMMENT '积分',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_dream_vote` 
ADD INDEX `dream_id` (`dream_id` ASC);

ALTER TABLE `yougouwx`.`wex_dream_vote` 
ADD UNIQUE INDEX `unique` (`dream_id` ASC, `sub_open_id` ASC);

