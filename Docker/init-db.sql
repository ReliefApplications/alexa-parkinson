CREATE DATABASE  IF NOT EXISTS `alexa_parkinson` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `alexa_parkinson`;
-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: 0.0.0.0    Database: alexa_parkinson
-- ------------------------------------------------------
-- Server version	8.0.16

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
-- Table structure for table `medicine`
--

-- DROP TABLE IF EXISTS `medicine`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
-- CREATE TABLE `medicine` (
--   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(255) NOT NULL,
--   `type_id` int(11) unsigned NOT NULL,
--   `active_principle` varchar(255) NOT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `name_UNIQUE` (`name`),
--   UNIQUE KEY `id_UNIQUE` (`id`),
--   KEY `fk_type_idx` (`type_id`),
--   CONSTRAINT `fk_type` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine`
--

-- LOCK TABLES `medicine` WRITE;
-- /*!40000 ALTER TABLE `medicine` DISABLE KEYS */;
-- INSERT INTO `medicine` VALUES (1,'Ibuprofen',1,'Ibuprofen');
-- /*!40000 ALTER TABLE `medicine` ENABLE KEYS */;
-- UNLOCK TABLES;

-- --
-- -- Table structure for table `quantity_left`
-- --

-- DROP TABLE IF EXISTS `quantity_left`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
-- CREATE TABLE `quantity_left` (
--   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `medicine_id` int(10) unsigned NOT NULL,
--   `user_id` int(10) unsigned NOT NULL,
--   `quantity` int(10) unsigned NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `fk_medicine_idx` (`medicine_id`),
--   KEY `fk_user_idx` (`user_id`),
--   CONSTRAINT `fk_medicine` FOREIGN KEY (`medicine_id`) REFERENCES `medicine` (`id`),
--   CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `quantity_left`
-- --

-- LOCK TABLES `quantity_left` WRITE;
-- /*!40000 ALTER TABLE `quantity_left` DISABLE KEYS */;
-- INSERT INTO `quantity_left` VALUES (1,1,1,100);
-- /*!40000 ALTER TABLE `quantity_left` ENABLE KEYS */;
-- UNLOCK TABLES;

-- --
-- -- Table structure for table `type`
-- --

-- DROP TABLE IF EXISTS `type`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!40101 SET character_set_client = utf8 */;
-- CREATE TABLE `type` (
--   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `type` varchar(255) NOT NULL,
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `id_UNIQUE` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

-- --
-- -- Dumping data for table `type`
-- --

-- LOCK TABLES `type` WRITE;
-- /*!40000 ALTER TABLE `type` DISABLE KEYS */;
-- INSERT INTO `type` VALUES (1,'pill');
-- /*!40000 ALTER TABLE `type` ENABLE KEYS */;
-- UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `amazon_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'AE6YYIV3534MRCMEMWO2AUOFBXQ3J5DCVDLRJU466ACEFHWE2XNVDIU7UWF5MD2B3TPBR6XPIT6NTEB5ADDKZMB6MQ2ZY7WFYWXBHOGOZEFXEIRE7W6IHOLSIWOKDQXMLMI4BR464YISG2KL7RU43JPID4AWTOMKAIRG6QX2FTQINTCGRDFCHQFUXYRWCXZKKE5U4WQYQMFVCE');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-21 10:23:49