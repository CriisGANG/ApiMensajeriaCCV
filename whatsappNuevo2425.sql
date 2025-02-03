-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-01-2025 a las 15:50:26
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `whatsapp2425`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `groups`
--

INSERT INTO `groups` (`id`, `name`, `admin_id`, `created_at`, `updated_at`) VALUES
(101, 'CCV', 6, '2025-01-24 18:25:48', '2025-01-25 15:19:02'),
(102, 'Solfamidas', 8, '2025-01-25 15:17:48', '2025-01-25 15:17:48'),
(103, 'Clase', 10, '2025-01-25 15:17:48', '2025-01-25 15:17:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_members`
--

CREATE TABLE `group_members` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `group_members`
--

INSERT INTO `group_members` (`id`, `group_id`, `user_id`, `is_admin`, `joined_at`) VALUES
(1, 101, 6, 1, '2025-01-24 18:27:39'),
(2, 101, 14, 0, '2025-01-24 18:27:39'),
(3, 101, 15, 0, '2025-01-24 18:27:39'),
(4, 102, 18, 0, '2025-01-25 15:21:00'),
(5, 102, 19, 0, '2025-01-25 15:21:00'),
(6, 102, 13, 0, '2025-01-25 15:21:00'),
(7, 102, 4, 1, '2025-01-25 15:22:02'),
(8, 103, 1, 0, '2025-01-25 15:24:52'),
(9, 103, 2, 0, '2025-01-25 15:24:52'),
(10, 103, 3, 0, '2025-01-25 15:24:52'),
(11, 103, 4, 1, '2025-01-25 15:24:52'),
(12, 103, 5, 0, '2025-01-25 15:24:52'),
(13, 103, 6, 0, '2025-01-25 15:24:52'),
(14, 103, 7, 0, '2025-01-25 15:24:52'),
(15, 103, 8, 0, '2025-01-25 15:24:52'),
(16, 103, 9, 0, '2025-01-25 15:24:52'),
(17, 103, 10, 1, '2025-01-25 15:24:52'),
(18, 103, 11, 1, '2025-01-25 15:24:52'),
(19, 103, 12, 0, '2025-01-25 15:24:52'),
(20, 103, 13, 0, '2025-01-25 15:24:52'),
(21, 103, 14, 0, '2025-01-25 15:24:52'),
(22, 103, 15, 0, '2025-01-25 15:24:52'),
(23, 103, 16, 0, '2025-01-25 15:24:52'),
(24, 103, 17, 0, '2025-01-25 15:24:52'),
(25, 103, 18, 1, '2025-01-25 15:24:52'),
(26, 102, 8, 0, '2025-01-25 15:26:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `group_message_status`
--

CREATE TABLE `group_message_status` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('rebut','llegit') DEFAULT 'rebut',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `status` enum('enviat','rebut','llegit') DEFAULT 'enviat',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `group_id`, `content`, `status`, `created_at`) VALUES
(15, 14, 14, NULL, 'Hola', 'rebut', '2025-01-25 15:12:49'),
(16, 14, 14, NULL, 'a', 'rebut', '2025-01-25 15:12:51'),
(17, 14, 3, NULL, 'jkewntñl5ñ', 'enviat', '2025-01-26 14:36:42'),
(18, 14, 14, NULL, 's', 'rebut', '2025-01-26 14:48:06'),
(19, 6, NULL, 101, 'Buenas tardes chicas, ¿cómo vais?', 'llegit', '2025-01-26 15:07:05'),
(20, 14, 12, NULL, '243rfgfa', 'enviat', '2025-01-26 17:47:10'),
(21, 14, NULL, 101, 'arw3545', 'enviat', '2025-01-26 18:08:24'),
(22, 14, NULL, 101, 'Hola', 'enviat', '2025-01-26 18:11:30'),
(23, 14, NULL, 101, 'BSDGERE', 'enviat', '2025-01-26 18:34:09'),
(24, 14, NULL, 101, 'Prueba', 'enviat', '2025-01-26 18:36:21'),
(25, 14, NULL, 101, 'Aaaaa', 'enviat', '2025-01-26 18:37:57'),
(26, 14, NULL, 101, 'f', 'enviat', '2025-01-26 18:43:15'),
(27, 14, NULL, 101, '5467i', 'enviat', '2025-01-26 18:45:49'),
(28, 14, NULL, 103, '¿Hay algo de servidor para mañana?', 'enviat', '2025-01-26 20:11:42'),
(29, 14, 6, NULL, 'Hola Mundo', 'rebut', '2025-01-27 15:24:23'),
(30, 6, 14, NULL, 'Hola', 'rebut', '2025-01-27 15:24:37'),
(31, 14, NULL, 101, 'Probando', 'enviat', '2025-01-27 15:26:10'),
(32, 14, 6, NULL, '¿Funciona?', 'rebut', '2025-01-27 15:27:19'),
(33, 14, 6, NULL, 'Prueba 2', 'rebut', '2025-01-27 15:28:29'),
(34, 14, 6, NULL, 'Prueba 3', 'rebut', '2025-01-27 15:29:53'),
(35, 14, 6, NULL, 'Prueba 4', 'rebut', '2025-01-27 15:30:08'),
(36, 14, 6, NULL, 'Prueba 5', 'rebut', '2025-01-27 15:31:32'),
(37, 14, 6, NULL, 'Prueba 6', 'rebut', '2025-01-27 15:34:20'),
(38, 14, 6, NULL, 'Prueba 7', 'rebut', '2025-01-27 15:34:48'),
(39, 14, 6, NULL, 'Prueba 8', 'rebut', '2025-01-27 15:35:16'),
(40, 14, 6, NULL, 'Prueba 9', 'rebut', '2025-01-27 15:36:41'),
(41, 14, 6, NULL, 'Prueba 10', 'rebut', '2025-01-27 15:38:45'),
(42, 14, 6, NULL, 'Prueba 11', 'rebut', '2025-01-27 15:40:02'),
(43, 14, 6, NULL, 'Prueba 12', 'rebut', '2025-01-27 15:40:42'),
(44, 6, 14, NULL, 'Hola', 'rebut', '2025-01-27 15:48:36'),
(45, 6, 14, NULL, 'Sesion cerrada', 'rebut', '2025-01-27 15:49:09'),
(46, 6, 14, NULL, 'Holaaaaaaaaaaa', 'rebut', '2025-01-27 15:52:07'),
(47, 14, 6, NULL, 'aSfter', 'rebut', '2025-01-27 15:56:39'),
(48, 15, 6, NULL, 'Hey!', 'rebut', '2025-01-27 16:33:16'),
(49, 6, 15, NULL, 'HOla', 'rebut', '2025-01-27 16:33:31'),
(50, 6, 15, NULL, 'ooo', 'rebut', '2025-01-27 16:33:55'),
(51, 14, 15, NULL, 'Ola ', 'enviat', '2025-01-27 16:34:15'),
(52, 14, 15, NULL, '🌊', 'enviat', '2025-01-27 16:34:35'),
(53, 14, 14, NULL, 'SSSS', 'rebut', '2025-01-27 16:35:51'),
(54, 6, 15, NULL, 'f', 'rebut', '2025-01-27 16:40:03'),
(55, 6, 15, NULL, 'Superr', 'rebut', '2025-01-27 16:42:33'),
(56, 6, 15, NULL, 'Hola', 'rebut', '2025-01-27 16:43:18'),
(57, 6, 15, NULL, 'EEEEEEEEEE', 'rebut', '2025-01-27 16:48:00'),
(58, 14, 6, NULL, 'Akflenglrntyúkil', 'rebut', '2025-01-27 16:48:29'),
(59, 14, 6, NULL, 'ssss', 'rebut', '2025-01-27 16:50:39'),
(60, 15, 6, NULL, 'Estoy escribiendoteeee', 'rebut', '2025-01-27 17:07:27'),
(61, 15, 6, NULL, 'Holi holi ', 'rebut', '2025-01-27 17:08:17'),
(62, 15, 6, NULL, 'que guasaaa', 'rebut', '2025-01-27 17:14:34'),
(63, 15, 6, NULL, 'holiiiiiii que tal', 'rebut', '2025-01-27 17:27:11'),
(64, 14, 6, NULL, 'nasbrjknw', 'rebut', '2025-01-28 15:18:03'),
(65, 14, 6, NULL, 'njKErjkewjlkn', 'rebut', '2025-01-28 15:23:03'),
(66, 14, 6, NULL, '1', 'rebut', '2025-01-28 15:24:09'),
(67, 14, 6, NULL, '2', 'rebut', '2025-01-28 15:26:00'),
(68, 14, 6, NULL, '3', 'rebut', '2025-01-28 15:27:19'),
(69, 14, 6, NULL, '4', 'rebut', '2025-01-28 15:28:40'),
(70, 14, 6, NULL, '5', 'rebut', '2025-01-28 15:30:28'),
(71, 14, 6, NULL, '6', 'rebut', '2025-01-28 15:30:44'),
(72, 14, 6, NULL, '7', 'rebut', '2025-01-28 15:32:33'),
(73, 14, 6, NULL, '8', 'rebut', '2025-01-28 15:34:38'),
(74, 14, 6, NULL, '1243', 'rebut', '2025-01-28 15:37:37'),
(75, 14, 6, NULL, '1243', 'rebut', '2025-01-28 15:37:37'),
(76, 14, 6, NULL, '9', 'rebut', '2025-01-28 15:39:48'),
(77, 14, 6, NULL, '9', 'rebut', '2025-01-28 15:39:48'),
(78, 14, 6, NULL, '10', 'rebut', '2025-01-28 15:46:21'),
(79, 14, 6, NULL, '11', 'rebut', '2025-01-28 15:46:27'),
(80, 14, 6, NULL, '12', 'rebut', '2025-01-28 15:48:29'),
(81, 14, 6, NULL, '13', 'rebut', '2025-01-28 15:48:54'),
(82, 14, 6, NULL, '15', 'rebut', '2025-01-28 15:49:10'),
(83, 14, 6, NULL, '48646', 'rebut', '2025-01-28 15:49:43'),
(84, 14, 6, NULL, '999', 'rebut', '2025-01-28 15:51:38'),
(85, 6, 14, NULL, '777', 'enviat', '2025-01-28 15:51:44'),
(86, 6, 14, NULL, 'a', 'enviat', '2025-01-28 15:53:12'),
(87, 6, 14, NULL, 'Bonju', 'enviat', '2025-01-28 15:54:45'),
(88, 6, 14, NULL, 'curasan', 'enviat', '2025-01-28 15:57:39'),
(89, 6, 14, NULL, 'a', 'enviat', '2025-01-28 15:59:00'),
(90, 14, 6, NULL, '54464989', 'rebut', '2025-01-28 15:59:10'),
(91, 6, 14, NULL, 'a', 'enviat', '2025-01-28 15:59:34'),
(92, 6, 14, NULL, 'eeee', 'enviat', '2025-01-28 15:59:49'),
(93, 6, 14, NULL, 'we', 'enviat', '2025-01-28 16:00:21'),
(94, 14, 6, NULL, '1221231123321', 'rebut', '2025-01-28 16:00:27'),
(95, 6, 15, NULL, 'h', 'rebut', '2025-01-28 16:58:01'),
(96, 6, 15, NULL, 'h', 'rebut', '2025-01-28 16:58:04'),
(97, 6, 15, NULL, 'HOla', 'rebut', '2025-01-28 16:59:10'),
(98, 6, 15, NULL, 'HOla', 'rebut', '2025-01-28 16:59:12'),
(99, 6, 15, NULL, 'Tomeu', 'rebut', '2025-01-28 16:59:21'),
(100, 6, 15, NULL, 'Tomeu', 'rebut', '2025-01-28 16:59:23'),
(101, 15, 6, NULL, 'esto funcionaaaaaa', 'rebut', '2025-01-28 17:06:55'),
(102, 15, 6, NULL, 'esto funcionaaaaaa', 'rebut', '2025-01-28 17:06:55'),
(103, 15, 6, NULL, 'vooooy', 'rebut', '2025-01-28 17:07:19'),
(104, 15, 6, NULL, 'vooooy', 'rebut', '2025-01-28 17:07:19'),
(105, 15, 6, NULL, 'hey', 'rebut', '2025-01-28 17:10:49'),
(106, 15, 6, NULL, 'hey', 'rebut', '2025-01-28 17:10:49'),
(107, 15, 6, NULL, 'pupum', 'rebut', '2025-01-28 17:13:58'),
(108, 15, 6, NULL, 'pupum', 'rebut', '2025-01-28 17:13:58'),
(109, 15, 6, NULL, 'pipim', 'rebut', '2025-01-28 17:14:21'),
(110, 15, 6, NULL, 'pipim', 'rebut', '2025-01-28 17:14:21'),
(111, 15, 6, NULL, 'tata', 'rebut', '2025-01-28 17:14:47'),
(112, 15, 6, NULL, 'tata', 'rebut', '2025-01-28 17:14:47'),
(113, 15, 6, NULL, 'turur´ñi', 'enviat', '2025-01-28 17:15:36'),
(114, 15, 6, NULL, 'turur´ñi', 'enviat', '2025-01-28 17:15:36'),
(115, 15, 6, NULL, 'essstoooo', 'enviat', '2025-01-28 17:16:13'),
(116, 15, 6, NULL, 'tutututut', 'enviat', '2025-01-28 17:16:31'),
(117, 15, 6, NULL, 'jijijji', 'enviat', '2025-01-28 17:19:55'),
(118, 15, 6, NULL, 'jijijji', 'enviat', '2025-01-28 17:19:55'),
(119, 15, 6, NULL, 'jojojoj', 'rebut', '2025-01-28 17:21:13'),
(120, 15, 6, NULL, 'jojojoj', 'rebut', '2025-01-28 17:21:14'),
(121, 15, 6, NULL, 'ahora', 'rebut', '2025-01-28 17:21:39'),
(122, 15, 6, NULL, 'nonojojoj', 'rebut', '2025-01-28 17:21:48'),
(123, 15, 6, NULL, 'nonojojoj', 'rebut', '2025-01-28 17:21:48'),
(124, 15, 6, NULL, 'tutututututuut', 'rebut', '2025-01-28 17:23:28'),
(125, 15, 6, NULL, 'tutututututuut', 'rebut', '2025-01-28 17:23:28'),
(126, 15, 6, NULL, 'dale', 'rebut', '2025-01-28 17:25:52'),
(127, 15, 6, NULL, 'dale', 'rebut', '2025-01-28 17:25:52'),
(128, 15, 6, NULL, 'hey', 'rebut', '2025-01-28 17:26:20'),
(129, 15, 6, NULL, 'hey', 'rebut', '2025-01-28 17:26:20'),
(130, 15, 6, NULL, 'ahora', 'rebut', '2025-01-28 17:27:45'),
(131, 15, 6, NULL, 'ahora', 'rebut', '2025-01-28 17:27:45'),
(132, 15, 6, NULL, 'que hay', 'enviat', '2025-01-28 17:47:04'),
(133, 15, 6, NULL, 'hola', 'enviat', '2025-01-28 17:47:15'),
(134, 15, 6, NULL, 'hola', 'enviat', '2025-01-28 17:47:20'),
(135, 15, 6, NULL, 'qué hay', 'enviat', '2025-01-28 17:48:15'),
(136, 15, 6, NULL, 'veo veo', 'enviat', '2025-01-28 17:53:13'),
(137, 15, 6, NULL, '83984923842973r', 'enviat', '2025-01-28 18:00:22'),
(138, 15, 6, NULL, 'jejejej', 'enviat', '2025-01-28 18:00:33'),
(139, 15, 6, NULL, 'Ahora funciona', 'enviat', '2025-01-28 18:01:59'),
(140, 6, 15, NULL, 'Hola', 'enviat', '2025-01-28 19:01:47'),
(141, 14, 6, NULL, 'yd678o9poi', 'enviat', '2025-01-29 18:34:18'),
(142, 6, 14, NULL, 'aaa', 'rebut', '2025-01-29 18:37:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `updated_at`) VALUES
(1, 'user2', 'scrypt:32768:8:1$YkMZtFeB6CbOWKqm$f09c184d74e48f073c571d45b3efdc42c9570a0b900ec01a4c7eedd7586f4cf2d1a25ea0b24e5ee7f9c869e8c0aee83d5827e30febfdf728df7e71a78375f06b', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(2, 'user3', 'scrypt:32768:8:1$hTJjwKlJeCthi8up$d86c17cc6169b55eaa1ebbe5ae9f67faabee7a605edf73420722863bb083b194738cde65b2ef96b20c792021313f0bfa7875133106b84e95b88b6a14a4804738', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(3, 'alanadrianadamski', 'scrypt:32768:8:1$oNRsuQqlApQIS44G$d3662de915ee2be9a1271a418404160dae4e5ffa63f053e90302a91f65dc5e1f3d6c6be84f1692bb4244a870ca830a8617bf553663b9c3c52eaede0a764dfd9c', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(4, 'matiasianbastero', 'scrypt:32768:8:1$WBC6y0Zy2dIIZU9s$0754ab9a425c76e82d29742df5da748cd7cee07b28c703d3891547d882679c4cb73dc237034d6f5b3c1e5518a97f33c30491b4e065f25e02e611eb66e0fbc26b', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(5, 'jaumebauza', 'scrypt:32768:8:1$wp0IeOyeoGKcJMWs$f90d1c2fa8750b5a2f7d9c5cb66b0d8731be1817dc36c04e5b56ca2eb3c8adbfda26df76bd8a54dbda761bd2b88f7f8e87eba4543a830f8ccb576a4045ffa00e', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(6, 'cristofolcomas', 'scrypt:32768:8:1$Al7giKfi0PxzIHOr$8c85322fc734de61d50c95387055cf431993321b0f7f5f49ddbff2f59f9209d6e04bb7ffe8e1740842460d8bd5f19c150fb06525c5e845c39846963ec3e65258', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(7, 'marccorcoles', 'scrypt:32768:8:1$45w7i250F8em2LOH$e31f09d5d2f3854c194a03b51fd0e1d27c4144e916b8e392fc98608d2cf26f3d7e7a192b0e0e8e294bdbadbbd0f0cfc29a4a44fb0e10ad8e19031058ed5f9321', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(8, 'joancortes', 'scrypt:32768:8:1$xjfkMTQUJDiqGwl3$72cf0a680b1a0bf27a05f4168f639ebc39a0b354fa0aac9843ccf7313db39f007f6f2481b42271f64ddea790151f7f72e4223272db1393d98c81998218e1ceb0', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(9, 'paucortes1', 'scrypt:32768:8:1$m2fpq3SiDbEM7Wqc$07e9f2d62850cf39516e5ce6978c98143460b8cfb51bc5147b9fdc0883a7d4aac3cfac00eeab2f2608e43b1ab74cf44ad185838cc7c842ab4abdb93eb0c3ea45', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(10, 'rubenespinar', 'scrypt:32768:8:1$ItKEBt7nwWfvQbyU$e322876e746b1cc0c8739d9a6434dd42103ef2731d73a0cff40f24f6b6b08033b1f792cf8af6859f8843399e16bfdf7e2abfa84a03761a0c3c98f9fa1e9e8820', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(11, 'miquelgarcia', 'scrypt:32768:8:1$rxOOJJZjtrEeL8sq$35e7354151a9eef3f9d0798e3dcd33669ee21be58c77a2ff801163a5a3b0969ad9176e6e88c0956d71555820a3db0c9d297af6d88e2394e62713806b7082bb0b', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(12, 'helenagoncalves', 'scrypt:32768:8:1$8MxcDlxAy6VOFIsF$700dee872ef54dcc1db0f3931b6211d111b51d266177a846bd753535d6e3813f13560b62e497e53c5e891ae03d04fb878a92d5ff50e28279df1f44c797429800', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(13, 'manuelguerrero', 'scrypt:32768:8:1$1xzF1gvSc2rowI7d$70fbe80fa969ff9ef038394aa357f535ad68950cb638ae3584ebd3e45750c404bd64c977b5daefad894f01f709fe8ebcd042245ed4d4b1fa7892522bac9d4506', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(14, 'virginiajimenez', 'scrypt:32768:8:1$GSjthG0gZio6gDGj$1835fc4d67ccbc7641bb528451d530f1e87d647dbdadaeec68883422e1103363787139ce3c45e9a8427df5b1090cd27449105068a3c9abf65057db7a65abafd5', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(15, 'cristinalopez', 'scrypt:32768:8:1$JeqIZ3AS9xNnxFyY$72ede924802cc937ef8ef08f1583b9f61d20510943e8ae6be67fa986f721a466ee4fdd1b05e0359f0bab24721111096b920fb20047d58dbf8da4d18611bf9f9d', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(16, 'ivanmartin', 'scrypt:32768:8:1$DPVYV0vIZID9y6O6$b718e9d6dddccbd220b218196f33cef51cb21825e4bebab777b8b7a0c7cbc10e4a2f6557579f723bf08e7c6de9b5076de8501f8c4ab4a212e746a68235ed83d2', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(17, 'bartomeumoya', 'scrypt:32768:8:1$YJOXf2RTFpr1feEL$00d550324260bc0f1264320c7c21ad20b693091411c653cc0f7bb641b3eaa432a676db4f0bc811eb2cba29a85cba192f54e88e82e821e57609e48bb863dc4914', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(18, 'facundonastasi', 'scrypt:32768:8:1$WTPabZLLRZwf4ozJ$e463658a55ec45782bbacc24a4b35272f6bc017af60fe20e6ecac8d6d431a4da4901f340f2535f0a55ec8ccfb08231cc75275fe6112dc1269a06f868d186e4a7', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(19, 'tomaspayeras', 'scrypt:32768:8:1$PDTxAfneCIFfgoTw$3388d5ac4a28a5a92bf83b1154ef7e0b3428d62ce675a1bc7effa5fd9f293a6bbf3278ba897240bf7ef5f5df9dcb3c359d6df941644621dcfb38bf0768a6c0a7', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(20, 'danielramon', 'scrypt:32768:8:1$4j9IHKNTZJ5g4gmV$ad765fec3b1e29be5943e6025936ebce50b1bd0e78b2f23fbe2dc0d8325594034637749d0e4c2b45e53172e724b0e8bf16c5c5cff30eeb667d27e63ccb6759d3', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(21, 'mariaelenarivilla', 'scrypt:32768:8:1$mFhpsoDYIPdmH6bh$e7e4cf76a6b4a277882552f62b6116bc321230554db17ca3ead1070bea4b5db8a715d9ff1993de77448c92c16945ce4ca1fa17ea661a980b4827184d237ceb10', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(22, 'tomasruiz', 'scrypt:32768:8:1$lPU6ExP9GDdbSxGm$cc97208d77a25caef81444489c38dc893f22af9d52af7dc6c2e974b359d960c0cd492d946236ee082cf33061bb7e2e88f10bf76f868dcbcef654605d0f07222e', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(23, 'hernanmeliveosandoval', 'scrypt:32768:8:1$Jj2VmxoAshxbnkln$c6974bd5d00e015121d45878f88108281f4d43c1c2fab4c1759a7ca467e6d4bf23716475ae16dc1a133a691fbad20f4f676f1029fb7033ae4e006fa7690137e1', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(24, 'pereserra', 'scrypt:32768:8:1$DwbISHmY3dECGNbD$233424e703c59369948e69a3b5353a4e71526b39d718031c1be9b03a6ae95dc6755e8e70662d0a5ad6b3cf12f542b4426eefd860bee9fcf49abafd9bde6ab9d3', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(25, 'sergitomas', 'scrypt:32768:8:1$g3ebvcvG9kavQzFc$05146c167966305c75a8196f13dc7c5504a7491cbd7f1333e41bd66421ec0110f806a77fbc23e7466fa4366de4c6fc81c269e63a17e68fe1facf4b87ffd2fa18', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(26, 'joanvicens', 'scrypt:32768:8:1$0RKG9sGcO7zed6Zg$74790cfbe32c1705d6c1ad8f2e0a91fc7a135fffc5ebe36d7f75e8c343d755787f53700332e3d5f1e07c1a6132932296e628f2f22ccb02557f0dfb58422ac61e', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(27, 'yukhangwong', 'scrypt:32768:8:1$bOcaeA1ZRFGmCrqT$a51dbdcf5738fd15c7ceaf5c7bafe3d1ad84fb3aaeae35667c694a1e8d8188cc58b9581992e5f503edf813916a227a7709e9148cf5c9f38e42e28892730ebc0d', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(32, 'user1', 'scrypt:32768:8:1$WEPJFaJjJwPpKXJc$85f45fef7d073181d4993f80178e373349a0c55e791679c7ce00ce2da2612f7cd57ebf437d6cd97f01fc35c6fdaad9197e9bd0d638092c7a59b528074619b69e', '2025-01-24 19:16:12', '2025-01-24 19:16:12'),
(60, 'virginia', 'clave123', '2025-01-27 14:54:43', '2025-01-27 14:54:43'),
(61, 'cristofol', 'secreta456', '2025-01-27 14:54:43', '2025-01-27 14:54:43'),
(62, 'cristina', 'password789', '2025-01-27 14:54:43', '2025-01-27 14:54:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarisclase`
--

CREATE TABLE `usuarisclase` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_profile_picture_url` varchar(400) NOT NULL,
  `user_bg_picture_url` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarisclase`
--

INSERT INTO `usuarisclase` (`id`, `username`, `password`, `user_profile_picture_url`, `user_bg_picture_url`) VALUES
(0, 'user1', 'scrypt:32768:8:1$WEPJFaJjJwPpKXJc$85f45fef7d073181d4993f80178e373349a0c55e791679c7ce00ce2da2612f7cd57ebf437d6cd97f01fc35c6fdaad9197e9bd0d638092c7a59b528074619b69e', '', ''),
(1, 'user2', 'scrypt:32768:8:1$YkMZtFeB6CbOWKqm$f09c184d74e48f073c571d45b3efdc42c9570a0b900ec01a4c7eedd7586f4cf2d1a25ea0b24e5ee7f9c869e8c0aee83d5827e30febfdf728df7e71a78375f06b', '', ''),
(2, 'user3', 'scrypt:32768:8:1$hTJjwKlJeCthi8up$d86c17cc6169b55eaa1ebbe5ae9f67faabee7a605edf73420722863bb083b194738cde65b2ef96b20c792021313f0bfa7875133106b84e95b88b6a14a4804738', '', ''),
(3, 'alanadrianadamski', 'scrypt:32768:8:1$oNRsuQqlApQIS44G$d3662de915ee2be9a1271a418404160dae4e5ffa63f053e90302a91f65dc5e1f3d6c6be84f1692bb4244a870ca830a8617bf553663b9c3c52eaede0a764dfd9c', '', ''),
(4, 'matiasianbastero', 'scrypt:32768:8:1$WBC6y0Zy2dIIZU9s$0754ab9a425c76e82d29742df5da748cd7cee07b28c703d3891547d882679c4cb73dc237034d6f5b3c1e5518a97f33c30491b4e065f25e02e611eb66e0fbc26b', '', ''),
(5, 'jaumebauza', 'scrypt:32768:8:1$wp0IeOyeoGKcJMWs$f90d1c2fa8750b5a2f7d9c5cb66b0d8731be1817dc36c04e5b56ca2eb3c8adbfda26df76bd8a54dbda761bd2b88f7f8e87eba4543a830f8ccb576a4045ffa00e', '', ''),
(6, 'cristofolcomas', 'scrypt:32768:8:1$Al7giKfi0PxzIHOr$8c85322fc734de61d50c95387055cf431993321b0f7f5f49ddbff2f59f9209d6e04bb7ffe8e1740842460d8bd5f19c150fb06525c5e845c39846963ec3e65258', 'https://cdn-icons-png.flaticon.com/512/3577/3577429.png', 'https://w7.pngwing.com/pngs/640/269/png-transparent-silhouette-person-people-icon-animals-logo-head-thumbnail.png'),
(7, 'marccorcoles', 'scrypt:32768:8:1$45w7i250F8em2LOH$e31f09d5d2f3854c194a03b51fd0e1d27c4144e916b8e392fc98608d2cf26f3d7e7a192b0e0e8e294bdbadbbd0f0cfc29a4a44fb0e10ad8e19031058ed5f9321', '', ''),
(8, 'joancortes', 'scrypt:32768:8:1$xjfkMTQUJDiqGwl3$72cf0a680b1a0bf27a05f4168f639ebc39a0b354fa0aac9843ccf7313db39f007f6f2481b42271f64ddea790151f7f72e4223272db1393d98c81998218e1ceb0', '', ''),
(9, 'paucortes1', 'scrypt:32768:8:1$m2fpq3SiDbEM7Wqc$07e9f2d62850cf39516e5ce6978c98143460b8cfb51bc5147b9fdc0883a7d4aac3cfac00eeab2f2608e43b1ab74cf44ad185838cc7c842ab4abdb93eb0c3ea45', '', ''),
(10, 'rubenespinar', 'scrypt:32768:8:1$ItKEBt7nwWfvQbyU$e322876e746b1cc0c8739d9a6434dd42103ef2731d73a0cff40f24f6b6b08033b1f792cf8af6859f8843399e16bfdf7e2abfa84a03761a0c3c98f9fa1e9e8820', '', ''),
(11, 'miquelgarcia', 'scrypt:32768:8:1$rxOOJJZjtrEeL8sq$35e7354151a9eef3f9d0798e3dcd33669ee21be58c77a2ff801163a5a3b0969ad9176e6e88c0956d71555820a3db0c9d297af6d88e2394e62713806b7082bb0b', '', ''),
(12, 'helenagoncalves', 'scrypt:32768:8:1$8MxcDlxAy6VOFIsF$700dee872ef54dcc1db0f3931b6211d111b51d266177a846bd753535d6e3813f13560b62e497e53c5e891ae03d04fb878a92d5ff50e28279df1f44c797429800', '', ''),
(13, 'manuelguerrero', 'scrypt:32768:8:1$1xzF1gvSc2rowI7d$70fbe80fa969ff9ef038394aa357f535ad68950cb638ae3584ebd3e45750c404bd64c977b5daefad894f01f709fe8ebcd042245ed4d4b1fa7892522bac9d4506', '', ''),
(14, 'virginiajimenez', 'scrypt:32768:8:1$GSjthG0gZio6gDGj$1835fc4d67ccbc7641bb528451d530f1e87d647dbdadaeec68883422e1103363787139ce3c45e9a8427df5b1090cd27449105068a3c9abf65057db7a65abafd5', 'https://static.vecteezy.com/system/resources/previews/003/428/270/non_2x/businessman-explain-pose-character-design-free-vector.jpg', ''),
(15, 'cristinalopez', 'scrypt:32768:8:1$JeqIZ3AS9xNnxFyY$72ede924802cc937ef8ef08f1583b9f61d20510943e8ae6be67fa986f721a466ee4fdd1b05e0359f0bab24721111096b920fb20047d58dbf8da4d18611bf9f9d', '', ''),
(16, 'ivanmartin', 'scrypt:32768:8:1$DPVYV0vIZID9y6O6$b718e9d6dddccbd220b218196f33cef51cb21825e4bebab777b8b7a0c7cbc10e4a2f6557579f723bf08e7c6de9b5076de8501f8c4ab4a212e746a68235ed83d2', '', ''),
(17, 'bartomeumoya', 'scrypt:32768:8:1$YJOXf2RTFpr1feEL$00d550324260bc0f1264320c7c21ad20b693091411c653cc0f7bb641b3eaa432a676db4f0bc811eb2cba29a85cba192f54e88e82e821e57609e48bb863dc4914', '', ''),
(18, 'facundonastasi', 'scrypt:32768:8:1$WTPabZLLRZwf4ozJ$e463658a55ec45782bbacc24a4b35272f6bc017af60fe20e6ecac8d6d431a4da4901f340f2535f0a55ec8ccfb08231cc75275fe6112dc1269a06f868d186e4a7', '', ''),
(19, 'tomaspayeras', 'scrypt:32768:8:1$PDTxAfneCIFfgoTw$3388d5ac4a28a5a92bf83b1154ef7e0b3428d62ce675a1bc7effa5fd9f293a6bbf3278ba897240bf7ef5f5df9dcb3c359d6df941644621dcfb38bf0768a6c0a7', '', ''),
(20, 'danielramon', 'scrypt:32768:8:1$4j9IHKNTZJ5g4gmV$ad765fec3b1e29be5943e6025936ebce50b1bd0e78b2f23fbe2dc0d8325594034637749d0e4c2b45e53172e724b0e8bf16c5c5cff30eeb667d27e63ccb6759d3', '', ''),
(21, 'mariaelenarivilla', 'scrypt:32768:8:1$mFhpsoDYIPdmH6bh$e7e4cf76a6b4a277882552f62b6116bc321230554db17ca3ead1070bea4b5db8a715d9ff1993de77448c92c16945ce4ca1fa17ea661a980b4827184d237ceb10', '', ''),
(22, 'tomasruiz', 'scrypt:32768:8:1$lPU6ExP9GDdbSxGm$cc97208d77a25caef81444489c38dc893f22af9d52af7dc6c2e974b359d960c0cd492d946236ee082cf33061bb7e2e88f10bf76f868dcbcef654605d0f07222e', '', ''),
(23, 'hernanmeliveosandoval', 'scrypt:32768:8:1$Jj2VmxoAshxbnkln$c6974bd5d00e015121d45878f88108281f4d43c1c2fab4c1759a7ca467e6d4bf23716475ae16dc1a133a691fbad20f4f676f1029fb7033ae4e006fa7690137e1', '', ''),
(24, 'pereserra', 'scrypt:32768:8:1$DwbISHmY3dECGNbD$233424e703c59369948e69a3b5353a4e71526b39d718031c1be9b03a6ae95dc6755e8e70662d0a5ad6b3cf12f542b4426eefd860bee9fcf49abafd9bde6ab9d3', '', ''),
(25, 'sergitomas', 'scrypt:32768:8:1$g3ebvcvG9kavQzFc$05146c167966305c75a8196f13dc7c5504a7491cbd7f1333e41bd66421ec0110f806a77fbc23e7466fa4366de4c6fc81c269e63a17e68fe1facf4b87ffd2fa18', '', ''),
(26, 'joanvicens', 'scrypt:32768:8:1$0RKG9sGcO7zed6Zg$74790cfbe32c1705d6c1ad8f2e0a91fc7a135fffc5ebe36d7f75e8c343d755787f53700332e3d5f1e07c1a6132932296e628f2f22ccb02557f0dfb58422ac61e', '', ''),
(27, 'yukhangwong', 'scrypt:32768:8:1$bOcaeA1ZRFGmCrqT$a51dbdcf5738fd15c7ceaf5c7bafe3d1ad84fb3aaeae35667c694a1e8d8188cc58b9581992e5f503edf813916a227a7709e9148cf5c9f38e42e28892730ebc0d', '', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indices de la tabla `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `group_message_status`
--
ALTER TABLE `group_message_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `group_id` (`group_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `usuarisclase`
--
ALTER TABLE `usuarisclase`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT de la tabla `group_members`
--
ALTER TABLE `group_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `group_message_status`
--
ALTER TABLE `group_message_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `group_message_status`
--
ALTER TABLE `group_message_status`
  ADD CONSTRAINT `group_message_status_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_message_status_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
