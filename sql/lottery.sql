CREATE TABLE `wex_lottery` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `name` varchar(200) DEFAULT NULL COMMENT '抽奖活动名称',
  `code` varchar(200) DEFAULT NULL COMMENT '活动编码',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_lottery` 
CHANGE COLUMN `code` `code` VARCHAR(200) NOT NULL COMMENT '活动编码' ;

CREATE TABLE `wex_lottery_cycle` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `lottery_id` varchar(36) NOT NULL COMMENT '抽奖活动标示',
  `code` int(10) NOT NULL COMMENT '周期编号',
  `base` int(100) DEFAULT NULL COMMENT '基础数据',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_lottery_cycle` 
ADD INDEX `Lottery` (`lottery_id` ASC, `code` ASC);

CREATE TABLE `wex_lottery_gambler` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `lottery_id` varchar(36) NOT NULL COMMENT '抽奖活动标示',
  `cycle_id` varchar(36) NOT NULL COMMENT '周期标示',
  `nickname` varchar(200) DEFAULT NULL COMMENT '昵称',
  `headimgurl` varchar(200) DEFAULT NULL COMMENT '头像',
  `open_id` varchar(200) NOT NULL COMMENT '公众号OpenID',
  `sub_open_id` varchar(200) DEFAULT NULL COMMENT '服务号OpenID',
  `enabled` tinyint(1) DEFAULT '1' COMMENT '是否有抽奖资格',
  `position` int(10) DEFAULT '1' COMMENT '抽奖编号',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_lottery_gambler` 
ADD INDEX `lottery` (`lottery_id` ASC, `cycle_id` ASC);

ALTER TABLE `yougouwx`.`wex_lottery_gambler` 
ADD INDEX `open_id` (`open_id` ASC);

ALTER TABLE `yougouwx`.`wex_lottery_gambler` 
ADD INDEX `enabled` (`enabled` ASC);

ALTER TABLE `yougouwx`.`wex_lottery_gambler` 
ADD INDEX `position` (`position` ASC);

CREATE TABLE `wex_dream_helper` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `lottery_id` varchar(36) NOT NULL COMMENT '抽奖活动标示',
  `cycle_id` varchar(36) NOT NULL COMMENT '周期标示',
  `gambler_id` varchar(36) NOT NULL COMMENT '赌徒标示',
  `sub_open_id` varchar(200) NOT NULL COMMENT '服务号OpenID',
  `bonus` int(10) NOT NULL DEFAULT 0 COMMENT '积分',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_lottery_helper` 
ADD INDEX `lottery` (`lottery_id` ASC, `cycle_id` ASC, `gambler_id` ASC, `sub_open_id` ASC);


CREATE TABLE `wex_lottery_winner` (
  `id` varchar(36) NOT NULL COMMENT '标示',
  `lottery_id` varchar(36) NOT NULL COMMENT '抽奖活动标示',
  `cycle_id` varchar(36) NOT NULL COMMENT '周期标示',
  `nickname` varchar(200) NOT NULL COMMENT '昵称',
  `headimgurl` varchar(200) NOT NULL COMMENT '头像',
  `open_id` varchar(200) NOT NULL COMMENT '公众号OpenID',
  `random` int(10) NOT NULL DEFAULT '1' COMMENT '随机数',
  `position` int(10) NOT NULL DEFAULT '1' COMMENT '抽奖编号',
  `prize` varchar(100) NOT NULL COMMENT '奖品编码',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1' COMMENT '是否存档',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_lottery_winner` 
ADD COLUMN `exchanged` TINYINT(1) NOT NULL DEFAULT 1 AFTER `archived`;

ALTER TABLE `yougouwx`.`wex_lottery_winner` 
ADD INDEX `winner` (`lottery_id` ASC, `cycle_id` ASC);

ALTER TABLE `yougouwx`.`wex_lottery_winner` 
ADD INDEX `openid` (`open_id` ASC);


