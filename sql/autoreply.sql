CREATE TABLE `wex_autoreply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `reply` text NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `archived` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8;

CREATE TABLE `wex_keyword` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reply_id` int(11) NOT NULL,
  `word` varchar(200) NOT NULL,
  `created_time` datetime DEFAULT NULL,
  `created_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `updated_by` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `archived` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `word_UNIQUE` (`word`),
  KEY `reply_id` (`reply_id`),
  KEY `word_index` (`word`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8;

ALTER TABLE `yougouwx`.`wex_autoreply` 
CHANGE COLUMN `id` `id` VARCHAR(36) NOT NULL ;

ALTER TABLE `yougouwx`.`wex_keyword` 
CHANGE COLUMN `id` `id` VARCHAR(36) NOT NULL ;

ALTER TABLE `yougouwx`.`wex_keyword` 
CHANGE COLUMN `reply_id` `reply_id` VARCHAR(36) NOT NULL ;
