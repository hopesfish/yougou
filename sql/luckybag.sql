CREATE TABLE `wex_luckybag` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `nickname` varchar(200) DEFAULT NULL COMMENT '昵称',
  `headimgurl` varchar(200) DEFAULT NULL COMMENT '头像',
  `open_id` varchar(200) NOT NULL COMMENT '公众号OpenID',
  `sub_open_id` varchar(200) DEFAULT NULL COMMENT '服务号OpenID',
  `bonus` int(10) NOT NULL DEFAULT '0' COMMENT '积分',
  `exchange` int(10) NOT NULL DEFAULT '0' COMMENT '是否兑换',
  `exchange_bag` int(4) DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`),
  KEY `openid_idx` (`open_id`),
  KEY `sub_open_id_idx` (`sub_open_id`),
  KEY `bonus` (`bonus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `wex_luckybag_vote` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `luckybag_id` varchar(36) NOT NULL COMMENT '福袋标示',
  `sub_open_id` varchar(200) NOT NULL COMMENT '服务号OpenID',
  `bonus` int(10) NOT NULL DEFAULT '0' COMMENT '积分',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  `headimgurl` varchar(200) DEFAULT NULL,
  `nickname` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique` (`luckybag_id`,`sub_open_id`),
  KEY `luckybag_id` (`luckybag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
