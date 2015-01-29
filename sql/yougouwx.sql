-- MySQL dump 10.13  Distrib 5.5.37, for Linux (x86_64)
--
-- Host: localhost    Database: yougouwx
-- ------------------------------------------------------
-- Server version	5.5.37-cll-lve

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `wex_activity`
--

DROP TABLE IF EXISTS `wex_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wex_activity` (
  `id` varchar(36) CHARACTER SET latin1 NOT NULL COMMENT '标示',
  `name` varchar(200) NOT NULL COMMENT '''活动名称''',
  `code` varchar(100) NOT NULL COMMENT '''触发编码''',
  `start_time` int(11) DEFAULT '0' COMMENT '''开始日期''',
  `end_time` int(11) DEFAULT '0' COMMENT '''结束日期''',
  `enabled` tinyint(1) unsigned zerofill NOT NULL DEFAULT '1' COMMENT '0 停止 1 启用',
  `created_by` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0 删除 1 在档',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wex_activity`
--

LOCK TABLES `wex_activity` WRITE;
/*!40000 ALTER TABLE `wex_activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `wex_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wex_coupon`
--

DROP TABLE IF EXISTS `wex_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wex_coupon` (
  `id` varchar(36) NOT NULL,
  `activity_id` varchar(36) NOT NULL,
  `batch` varchar(36) DEFAULT NULL,
  `code` varchar(200) NOT NULL,
  `open_id` varchar(100) DEFAULT NULL,
  `achieved_time` timestamp NULL DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` varchar(36) NOT NULL,
  `updated_time` timestamp NULL DEFAULT NULL,
  `archived` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wex_coupon`
--

LOCK TABLES `wex_coupon` WRITE;
/*!40000 ALTER TABLE `wex_coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `wex_coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wex_user`
--

DROP TABLE IF EXISTS `wex_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wex_user` (
  `id` char(36) NOT NULL,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` char(32) NOT NULL,
  `mobile` varchar(20) DEFAULT NULL COMMENT 'æ‰‹æœºå·',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` char(36) DEFAULT NULL,
  `updated_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_by` char(36) DEFAULT NULL,
  `archived` tinyint(4) DEFAULT '1',
  `name` varchar(30) DEFAULT NULL,
  `open_id` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wex_user`
--

LOCK TABLES `wex_user` WRITE;
/*!40000 ALTER TABLE `wex_user` DISABLE KEYS */;
INSERT INTO `wex_user` VALUES ('2d1ad05a-9f16-44f5-9795-9a986bc2aeea','admin','07bbb5e53ccfb65bbe65a64cca86a31c','13800000001','2014-04-30 04:41:29','system','2014-04-30 04:45:00','2d1ad05a-9f16-44f5-9795-9a986bc2aeea',1,'administrator',NULL,'null');
/*!40000 ALTER TABLE `wex_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-04-30 12:52:30
