CREATE TABLE `wex_wxgift` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `nickname` varchar(100) DEFAULT NULL COMMENT '昵称',
  `headimgurl` varchar(200) DEFAULT NULL COMMENT '头像',
  `open_id` varchar(50) DEFAULT NULL COMMENT '公众号OpenID',
  `sub_open_id` varchar(50) DEFAULT NULL COMMENT '服务号OpenID',
  `union_id` varchar(50) NOT NULL COMMENT '微信唯一标示',
  `shared` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否分享',
  `code` varchar(80) NOT NULL COMMENT '领到的优惠券编码',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
