-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: homeservices
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `permissions` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_userId_key` (`userId`),
  CONSTRAINT `admins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,10,'all');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Vodoinstalater','Popravka cevi, instalacija, kvariovi sa vodom','VOD',1),(2,'Stolar','Izrada nameštaja, popravke, ugradnja elemenata','STO',1),(3,'Keramičar','Postavljanje pločica, keramike, popravke u kupatilu','KER',1),(4,'Električar','Električne instalacije, popravke, ugradnja svetala','ELE',1),(5,'Moler','Krečenje, gletovanje, dekorativne tehnike','MOL',1),(6,'Klimatizer','Ugradnja i servis klima uređaja','KLI',1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `providerId` int NOT NULL,
  `lastMessage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastMessageAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `conversations_customerId_providerId_key` (`customerId`,`providerId`),
  KEY `conversations_providerId_fkey` (`providerId`),
  CONSTRAINT `conversations_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `conversations_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `service_providers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coverage_areas`
--

DROP TABLE IF EXISTS `coverage_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coverage_areas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `coverage_areas_serviceProviderId_fkey` (`serviceProviderId`),
  CONSTRAINT `coverage_areas_serviceProviderId_fkey` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coverage_areas`
--

LOCK TABLES `coverage_areas` WRITE;
/*!40000 ALTER TABLE `coverage_areas` DISABLE KEYS */;
INSERT INTO `coverage_areas` VALUES (1,1,'Novi Sad'),(2,1,'Futog'),(3,1,'Veternik'),(4,3,'Novi Sad'),(5,3,'Veternik'),(6,3,'Futog'),(7,3,'Begeč'),(8,2,'Beograd'),(9,2,'Novi Beograd'),(10,2,'Banovo Brdo'),(11,4,'Beograd'),(12,4,'Stari Grad'),(13,4,'Vračar'),(14,4,'Palilula'),(15,5,'Beograd'),(16,5,'Čukarica'),(17,5,'Voždovac'),(18,5,'Rakovica'),(19,7,'Novi Sad'),(20,7,'Petrovaradin'),(21,7,'Sremska Kamenica'),(22,7,'Detelinara'),(23,6,'Novi Sad'),(24,6,'Detelinara'),(25,8,'Novi Sad'),(26,8,'Veternik'),(27,8,'Futog'),(28,9,'Beograd'),(29,9,'Novi Beograd'),(30,9,'Zemun'),(31,9,'Zvezdara'),(32,11,'Beograd'),(33,11,'Zemun'),(34,11,'Surčin'),(35,11,'Mladenovac'),(36,10,'Novi Sad'),(37,10,'Sremska Kamenica'),(38,12,'Novi Sad'),(39,12,'Sremska Kamenica'),(40,12,'Petrovaradin'),(41,13,'Beograd'),(42,13,'Savski Venac'),(43,13,'Dorćol'),(44,13,'Karaburma'),(46,14,'Beograd');
/*!40000 ALTER TABLE `coverage_areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_userId_key` (`userId`),
  CONSTRAINT `customers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,9,'Bulevar oslobođenja 123','Novi Sad'),(2,11,'Jovana Ducića 12','Novi Sad'),(3,12,'Terazije 12','Beograd'),(4,13,'Futoška ulica 45','Novi Sad'),(5,14,'Knez Mihailova 25','Beograd'),(6,18,'Bulevar kralja Aleksandra 45','Beograd');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversationId` int NOT NULL,
  `senderId` int NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `messages_conversationId_fkey` (`conversationId`),
  KEY `messages_senderId_fkey` (`senderId`),
  CONSTRAINT `messages_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_items`
--

DROP TABLE IF EXISTS `portfolio_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `portfolio_items_serviceProviderId_fkey` (`serviceProviderId`),
  CONSTRAINT `portfolio_items_serviceProviderId_fkey` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_items`
--

LOCK TABLES `portfolio_items` WRITE;
/*!40000 ALTER TABLE `portfolio_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `portfolio_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customerId` int NOT NULL,
  `serviceProviderId` int NOT NULL,
  `rating` int NOT NULL,
  `comment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `reviews_customerId_fkey` (`customerId`),
  KEY `reviews_serviceProviderId_fkey` (`serviceProviderId`),
  CONSTRAINT `reviews_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `reviews_serviceProviderId_fkey` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_categories`
--

DROP TABLE IF EXISTS `service_provider_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_provider_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_provider_categories_serviceProviderId_categoryId_key` (`serviceProviderId`,`categoryId`),
  KEY `service_provider_categories_categoryId_fkey` (`categoryId`),
  CONSTRAINT `service_provider_categories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `service_provider_categories_serviceProviderId_fkey` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_categories`
--

LOCK TABLES `service_provider_categories` WRITE;
/*!40000 ALTER TABLE `service_provider_categories` DISABLE KEYS */;
INSERT INTO `service_provider_categories` VALUES (1,1,6),(4,2,2),(2,3,5),(3,4,4),(5,5,1),(8,6,4),(6,7,1),(7,7,4),(9,8,3),(10,9,3),(12,10,2),(11,11,6),(13,12,1),(14,13,5),(16,14,4);
/*!40000 ALTER TABLE `service_provider_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_providers`
--

DROP TABLE IF EXISTS `service_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `bio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience` int NOT NULL DEFAULT '0',
  `rating` double NOT NULL DEFAULT '0',
  `totalReviews` int NOT NULL DEFAULT '0',
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_providers_userId_key` (`userId`),
  CONSTRAINT `service_providers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_providers`
--

LOCK TABLES `service_providers` WRITE;
/*!40000 ALTER TABLE `service_providers` DISABLE KEYS */;
INSERT INTO `service_providers` VALUES (1,5,'Specijalizovan za ugradnju i servis klima uređaja svih brendova.',10,0,0,1),(2,4,'Stolar sa dugogodišnjim iskustvom u izradi kuhinja i garderoba po meri.',16,0,0,1),(3,2,'Moler-farbac sa 20 godina iskustva. Radim sa kvalitetnim bojama.',20,0,0,0),(4,6,'Električar sa atestom. Specijalizovan za pametne kuće i LED osvetljenje.',11,0,0,1),(5,7,'Licencirani vodoinstalater. Hitne intervencije 24/7 po celom Beogradu.',14,0,0,1),(6,3,'Licencionani električar. Specijalizovana za stambene instalacije.',8,0,0,1),(7,8,'Multifunkcionalan majstor - radim elektriku, vodu i manje adaptacije.',22,0,0,1),(8,1,'Imam 15 godina iskustva u postavljanju pločica i keramike. Radim precizno i kvalitetno.',15,0,0,1),(9,15,'Keramičar sa 18 godina iskustva u Beogradu. Specijalizovan za luksuzna kupatila.',18,0,0,1),(10,16,'Stolar sa dugogodišnjim iskustvom u izradi nameštaja po meri.',18,0,0,1),(11,17,'Klimatizer sa atestom za sve brendove klima uređaja. Brz i pouzdan servis.',13,0,0,1),(12,19,'Vodoinstalater sa dugogodišnjim iskustvom. Brza intervencija 24h.',12,0,0,1),(13,20,'Moler-farbac sa 25 godina iskustva. Radim dekorativne tehnike i restauraciju.',25,0,0,0),(14,21,'Veoma iskusan električar. Radim u struci već 15 godina',15,0,0,0);
/*!40000 ALTER TABLE `service_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `services_categoryId_fkey` (`categoryId`),
  CONSTRAINT `services_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'Popravka slavine','Popravka i zamena slavina',1),(2,1,'Čišćenje kanalizacije','Uklanjanje zapušenja iz cevi',1),(3,2,'Popravka nameštaja','Popravka stolica, stolova, ormara',1),(4,2,'Ugradnja polica','Izrada i ugradnja polica po meri',1),(5,3,'Postavljanje pločica','Profesionalno postavljanje pločica u kupatilu i kuhinji',1),(6,3,'Fugovanje','Fugovanje između pločica',1),(7,6,'Ugradnja klime','Montaža klima uređaja sa puštanjem u rad',1),(8,6,'Servis klime','Čišćenje i servisiranje klima uređaja',1),(9,4,'Ugradnja prekidača','Postavljanje prekidača i utičnica',1),(10,4,'Ugradnja lustera','Postavljanje lustera i svetala',1),(11,5,'Krečenje zidova','Farbanje i krečenje unutrašnjih zidova',1),(12,5,'Gletovanje','Gletovanje i priprema zidova za farbanje',1);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('CUSTOMER','SERVICE_PROVIDER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'marko.petrovic','marko.petrovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Marko Petrović','+381 64 123 4567','SERVICE_PROVIDER','2025-09-17 07:17:41.169','2025-09-17 07:17:41.169'),(2,'milan.jovanovic','milan.jovanovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Milan Jovanović','+381 60 111 2222','SERVICE_PROVIDER','2025-09-17 07:17:41.169','2025-09-17 07:17:41.169'),(3,'jovana.markovic','jovana.markovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Jovana Marković','+381 63 456 7890','SERVICE_PROVIDER','2025-09-17 07:17:41.169','2025-09-17 07:17:41.169'),(4,'marija.stojanovic','marija.stojanovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Marija Stojanović','+381 61 005 5555','SERVICE_PROVIDER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(5,'nikola.mitrovic','nikola.mitrovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Nikola Mitrović','+381 62 777 8888','SERVICE_PROVIDER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(6,'aleksandar.jovanovic','aleksandar.jovanovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Aleksandar Jovanović','+381 63 003 3333','SERVICE_PROVIDER','2025-09-17 07:17:41.169','2025-09-17 07:17:41.169'),(7,'milica.stankovic','milica.stankovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Milica Stanković','+381 65 002 2222','SERVICE_PROVIDER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(8,'vladimir.popovic','vladimir.popovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Vladimir Popović','+381 66 999 0000','SERVICE_PROVIDER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(9,'ana.jovanovic','ana.jovanovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Ana Jovanović','+381 64 555 1111','CUSTOMER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(10,'admin','admin@homeservices.com','$2b$10$0nx0rfWxxJYaTeobAgt/wOlGTEpS19UTLiEp85.WYXTu7jV.L.RTS','Administrator','+381 11 000 0000','ADMIN','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(11,'stefan.milenkovic','stefan.milenkovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Stefan Milenković','+381 65 444 5555','CUSTOMER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(12,'jovana.nikolic','jovana.nikolic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Jovana Nikolić','+381 65 999 3333','CUSTOMER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(13,'marija.petrovic','marija.petrovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Marija Petrović','+381 63 222 3333','CUSTOMER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(14,'milica.jovanovic','milica.jovanovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Milica Jovanović','+381 64 777 1111','CUSTOMER','2025-09-17 07:17:41.171','2025-09-17 07:17:41.171'),(15,'dragan.milosavljevic','dragan.milosavljevic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Dragan Milosavljević','+381 64 001 1111','SERVICE_PROVIDER','2025-09-17 07:17:41.171','2025-09-17 07:17:41.171'),(16,'petar.stojanovic','petar.stojanovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Petar Stojanović','+381 61 333 4444','SERVICE_PROVIDER','2025-09-17 07:17:41.171','2025-09-17 07:17:41.171'),(17,'milos.nikolic','milos.nikolic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Miloš Nikolić','+381 62 006 6666','SERVICE_PROVIDER','2025-09-17 07:17:41.171','2025-09-17 07:17:41.171'),(18,'stefan.mitrovic','stefan.mitrovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Stefan Mitrović','+381 63 888 2222','CUSTOMER','2025-09-17 07:17:41.171','2025-09-17 07:17:41.171'),(19,'stefan.nikolic','stefan.nikolic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Stefan Nikolić','+381 65 987 6543','SERVICE_PROVIDER','2025-09-17 07:17:41.172','2025-09-17 07:17:41.172'),(20,'nenad.mitrovic','nenad.mitrovic@email.com','$2b$10$nNLRAAJN098SMe9L1h4FIOw1OVn06l79m//8ZQlHaTkL5xwcSW21.','Nenad Mitrović','+381 60 004 4444','SERVICE_PROVIDER','2025-09-17 07:17:41.170','2025-09-17 07:17:41.170'),(21,'milanm','milanm@gmail.com','$2b$10$QoFvnJCGa4XT574ETCfAZ.2C60iyIts5ommNxwVewJMGScDXKitFS','Milan Milanovic','+38182381923','SERVICE_PROVIDER','2025-09-17 18:50:50.248','2025-09-17 18:57:45.067');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-17 21:46:42
