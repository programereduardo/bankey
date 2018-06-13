-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-06-2018 a las 02:14:51
-- Versión del servidor: 10.1.30-MariaDB
-- Versión de PHP: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_prestamos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacoras`
--

CREATE TABLE `bitacoras` (
  `bit_id` int(11) NOT NULL COMMENT 'codigo autoincremental',
  `ter_id` int(11) NOT NULL COMMENT 'codigo de cliente clientes->cli_id',
  `bit_tipocontacto` varchar(45) NOT NULL COMMENT 'metodo en que fue cnotactado el cliente',
  `bit_observacion` varchar(500) NOT NULL COMMENT 'resumen reelevante de la conversacion',
  `bit_fechahora` datetime DEFAULT NULL COMMENT 'fecha y hora de la conversacion',
  `bit_recordatorio` enum('S','N') DEFAULT NULL COMMENT 'di desea incluir en el calendario el recordatorio '
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ci_sessions`
--

CREATE TABLE `ci_sessions` (
  `id` varchar(500) COLLATE utf8_spanish2_ci NOT NULL,
  `ip_address` varchar(100) COLLATE utf8_spanish2_ci NOT NULL,
  `timestamp` int(11) NOT NULL,
  `data` text COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `ci_sessions`
--

INSERT INTO `ci_sessions` (`id`, `ip_address`, `timestamp`, `data`) VALUES
('4iqjnsva881hoetdje5d9n3m9uvktb60', '127.0.0.1', 1528737850, '__ci_last_regenerate|i:1528737850;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('0gsq4msp449sl3iam0i8og1iaco6h6lv', '127.0.0.1', 1528738335, '__ci_last_regenerate|i:1528738335;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('6gocci5epq70oj5smq7t6b9975d1cu8v', '127.0.0.1', 1528740404, '__ci_last_regenerate|i:1528740404;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('pd3g1na4ss0cfummivc3s8ve8espftu6', '127.0.0.1', 1528740409, '__ci_last_regenerate|i:1528740404;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('4cr1a6k3b19bas23vr4bu449q3hkcc8u', '127.0.0.1', 1528753938, '__ci_last_regenerate|i:1528753938;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('h4k79hodm1u11qjqo0t76v86mol8qh2m', '127.0.0.1', 1528754256, '__ci_last_regenerate|i:1528754256;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('2gitndjscjl9c8cgi99o2j02g10lgkbf', '127.0.0.1', 1528754591, '__ci_last_regenerate|i:1528754591;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('sjhflrjkrg2dkbdf0mkjmkmpbe4trllh', '127.0.0.1', 1528754997, '__ci_last_regenerate|i:1528754997;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('8c8tsobnae0te1gsd4lnug143719bfbj', '127.0.0.1', 1528755676, '__ci_last_regenerate|i:1528755676;'),
('dpno7v4gr89c965cl097rkvlp86qv8pl', '127.0.0.1', 1528756033, '__ci_last_regenerate|i:1528756033;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('2m1mnonf5j0vik9o6u2onk5ogedo0h9k', '127.0.0.1', 1528756337, '__ci_last_regenerate|i:1528756337;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('q9v7sn10nva32av90kgl9tgs1akroec2', '127.0.0.1', 1528756645, '__ci_last_regenerate|i:1528756645;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('ql73v8pqaer5fdoceftsb7cttppk937i', '127.0.0.1', 1528756964, '__ci_last_regenerate|i:1528756964;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('gla0nq3iivt052l7oq4lp8h6pcr2s6se', '127.0.0.1', 1528757285, '__ci_last_regenerate|i:1528757285;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('c3ficko73mmaccdrg7vrvg94d3nqu5n3', '127.0.0.1', 1528758250, '__ci_last_regenerate|i:1528758250;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('cp50kch1bj22g1t93vr1u59rev290817', '127.0.0.1', 1528758618, '__ci_last_regenerate|i:1528758618;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('7uebq2bns6li9kh4p2la11adj12k9m43', '127.0.0.1', 1528758964, '__ci_last_regenerate|i:1528758964;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('196s6ordj0rt7a3iko1i0folphot2c9k', '127.0.0.1', 1528759384, '__ci_last_regenerate|i:1528759384;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('tfk9vja54e0200aqa58nim6in7hvinpd', '127.0.0.1', 1528759692, '__ci_last_regenerate|i:1528759692;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('ejiu6ejera84opndb97n6hfsf7p11r1o', '127.0.0.1', 1528760024, '__ci_last_regenerate|i:1528760024;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('782ipvv0h7lqnrbkcc7al999qsij5vr6', '127.0.0.1', 1528760498, '__ci_last_regenerate|i:1528760498;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('v35fd4km8l16e5t9t95u7fc556n5b6lm', '127.0.0.1', 1528760841, '__ci_last_regenerate|i:1528760841;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('u0cuckijt91r5guks48v8p0apqpb9itj', '127.0.0.1', 1528761188, '__ci_last_regenerate|i:1528761188;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('05s7mj8cba0cnkp2kndhlvr1cebkv4tj', '127.0.0.1', 1528761520, '__ci_last_regenerate|i:1528761520;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";'),
('qpnu0p5gp2i6ghnm9ev9qa6kpoutkhjp', '127.0.0.1', 1528761804, '__ci_last_regenerate|i:1528761520;codigo|s:1:\"1\";estado|s:1:\"1\";usuario|s:5:\"admin\";apellidos|N;email|N;logueado|b:1;rol|s:13:\"Administrador\";tercero|s:1:\"0\";interes|d:0.2;');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `creditos`
--

CREATE TABLE `creditos` (
  `cre_id` int(11) NOT NULL COMMENT 'codigo autoincremental de la tabla',
  `ter_id` int(11) NOT NULL COMMENT 'codigo del cliente clientes->cli_id',
  `cre_tipo` smallint(1) DEFAULT NULL COMMENT 'tipo de credito',
  `cre_valor` decimal(10,0) NOT NULL COMMENT 'valor prestado',
  `cre_interes` double NOT NULL COMMENT 'porcentaje de interes del prestamo',
  `cre_mora` double DEFAULT NULL,
  `cre_fechaprest` date DEFAULT NULL COMMENT 'fecha en que fue realizado el prestamo',
  `cre_estado` enum('A','*') DEFAULT NULL COMMENT 'estado del credito\nA activo\n* inactivo',
  `ter_id(dds)` int(11) DEFAULT NULL,
  `cre_saldocapital` decimal(10,0) DEFAULT NULL,
  `cre_fechapaginicial` date DEFAULT NULL,
  `cre_descuento` decimal(10,0) DEFAULT NULL,
  `cre_numcuotas` int(11) DEFAULT NULL,
  `cre_usucrea` varchar(45) DEFAULT NULL,
  `cre_usumod` varchar(45) DEFAULT NULL,
  `cre_fecmod` date DEFAULT NULL,
  `cre_usuanula` varchar(45) DEFAULT NULL,
  `cre_fecanula` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `fac_id` int(11) NOT NULL COMMENT 'codigo autoincremental de la tabla',
  `pag_id` int(11) NOT NULL COMMENT 'codigo de pago pagos->pag_id',
  `fac_valor` double NOT NULL COMMENT 'valor pagado del prestamo',
  `fac_abonocapital` double NOT NULL COMMENT 'valor cancelado del capital',
  `fac_abonointeres` double NOT NULL COMMENT 'abonado al interes',
  `fac_fecha` date NOT NULL COMMENT 'fecha de facturacion',
  `fac_saldocapita` varchar(45) DEFAULT NULL,
  `fac_saldointeres` varchar(45) DEFAULT NULL,
  `fac_metodofacturacion` enum('W','C','T','N') DEFAULT 'N' COMMENT 'metodo en que fue enviada la factura\nW whatsapp\nC correo\nt mensaje de texto\nN ninguno\n\n',
  `fac_estado` enum('S','N') DEFAULT NULL COMMENT 'estado de la facturacion \nS enviado\nN no enviado',
  `fac_fecenvio` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `pag_id` int(11) NOT NULL COMMENT 'codigo autoincremental de la tabla',
  `cre_id` int(11) NOT NULL COMMENT 'codigo de credito creditos->cre_id',
  `pag_valor` decimal(10,0) NOT NULL,
  `pag_abonocapital` decimal(10,0) NOT NULL COMMENT 'abono al capital',
  `pag_abonointeres` decimal(10,0) NOT NULL COMMENT 'valor interes cancelado',
  `pag_saldocapital` decimal(10,0) NOT NULL COMMENT 'valor pendiente de la deuda',
  `pag_saldointeres` decimal(10,0) NOT NULL,
  `pag_fechapago` date NOT NULL COMMENT 'fecha en que fue realizado el pago'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_acciones`
--

CREATE TABLE `seg_acciones` (
  `acc_codigo` int(11) NOT NULL,
  `acc_estado` enum('1','2') COLLATE utf8_spanish2_ci NOT NULL COMMENT 'Este es el estado de un registro. 1 = Activo, 2 = Inactivo.',
  `acc_descripcion` varchar(200) COLLATE utf8_spanish2_ci NOT NULL COMMENT 'Descripción de la acción; Ver, Modificar, Borrar, etc.',
  `acc_modulo` int(11) NOT NULL COMMENT 'Esta es una FK que apunta al campo MOD_CODIGO de la tabla SEG_MODULOS. Nos dice a que modulo pertenece una acción.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seg_acciones`
--

INSERT INTO `seg_acciones` (`acc_codigo`, `acc_estado`, `acc_descripcion`, `acc_modulo`) VALUES
(1, '1', 'Ver', 1),
(2, '1', 'Modificar', 1),
(3, '1', 'Eliminar', 1),
(4, '1', 'Ver', 2),
(5, '1', 'Modificar', 2),
(6, '1', 'Eliminar', 2),
(7, '1', 'Ver', 3),
(8, '1', 'Modificar', 3),
(9, '1', 'Eliminar', 3),
(10, '1', 'Ver', 4),
(11, '1', 'Modificar', 4),
(12, '1', 'Eliminar', 4),
(13, '1', 'Ver', 5),
(14, '1', 'Modificar', 5),
(15, '1', 'Eliminar', 5),
(16, '1', 'Ver', 6),
(17, '1', 'Modificar', 6),
(18, '1', 'Eliminar', 6),
(19, '1', 'Ver', 7),
(20, '1', 'Modificar', 7),
(21, '1', 'Eliminar', 7),
(22, '1', 'Crear', 1),
(23, '1', 'Crear', 2),
(24, '1', 'Crear', 3),
(25, '1', 'Crear', 4),
(26, '1', 'Crear', 5),
(27, '1', 'Crear', 6),
(28, '1', 'Crear', 7),
(29, '1', 'Crear', 8),
(30, '1', 'Modificar', 8),
(31, '1', 'Ver', 8),
(32, '1', 'Eliminar', 8),
(33, '1', 'Crear', 9),
(34, '1', 'Modificar', 9),
(35, '1', 'Eliminar', 9),
(36, '1', 'Ver', 9),
(37, '1', 'Ver', 10),
(38, '1', 'Crear', 10),
(39, '1', 'Modificar', 10),
(40, '1', 'Eliminar', 10),
(41, '1', 'Ver', 11),
(42, '1', 'Crear', 11),
(43, '1', 'Modificar', 11),
(44, '1', 'Eliminar', 11),
(45, '1', 'Ver', 12),
(46, '1', 'Modificar', 12),
(47, '1', 'Eliminar', 12),
(48, '1', 'Crear', 12),
(49, '1', 'Ver', 13),
(50, '1', 'Modificar', 13),
(51, '1', 'Eliminar', 13),
(52, '1', 'Crear', 13),
(53, '1', 'Ver', 14),
(54, '1', 'Modificar', 14),
(55, '1', 'Eliminar', 14),
(56, '1', 'Crear', 14),
(57, '1', 'Ver', 15),
(58, '1', 'Modificar', 15),
(59, '1', 'Eliminar', 15),
(60, '1', 'Crear', 15),
(61, '1', 'Ver', 16),
(62, '1', 'Modificar', 16),
(63, '1', 'Eliminar', 16),
(64, '1', 'Crear', 16),
(65, '1', 'Ver', 17),
(66, '1', 'Modificar', 17),
(67, '1', 'Eliminar', 17),
(68, '1', 'Crear', 17),
(69, '1', 'Ver', 18),
(70, '1', 'Modificar', 18),
(71, '1', 'Eliminar', 18),
(72, '1', 'Crear', 18),
(73, '1', 'Ver', 19),
(74, '1', 'Modificar', 19),
(75, '1', 'Eliminar', 19),
(76, '1', 'Crear', 19),
(77, '1', 'Ver', 20),
(78, '1', 'Modificar', 20),
(79, '1', 'Eliminar', 20),
(80, '1', 'Crear', 20),
(81, '1', 'Crear', 21),
(82, '1', 'Modificar', 21),
(83, '1', 'Ver', 21),
(84, '1', 'Eliminar', 21),
(85, '1', 'Eliminar', 22),
(86, '1', 'Ver', 22),
(87, '1', 'Modificar', 22),
(88, '1', 'Crear', 22),
(89, '1', 'Eliminar', 23),
(90, '1', 'Ver', 23),
(91, '1', 'Modificar', 23),
(92, '1', 'Crear', 23),
(93, '1', 'Abonar', 1),
(94, '1', 'Ver', 24),
(95, '1', 'Crear', 24),
(96, '1', 'Modificar', 24),
(97, '1', 'Eliminar', 24),
(98, '1', 'Ver', 25),
(99, '1', 'Crear', 25),
(100, '1', 'Modificar', 25),
(101, '1', 'Eliminar', 25),
(102, '1', 'Ver', 26),
(103, '1', 'Crear', 26),
(104, '1', 'Modificar', 26),
(105, '1', 'Eliminar', 26),
(106, '1', 'Ver', 27),
(107, '1', 'Crear', 27),
(108, '1', 'Modificar', 27),
(109, '1', 'Eliminar', 27),
(110, '1', 'Ver', 28),
(111, '1', 'Crear', 28),
(112, '1', 'Modificar', 28),
(113, '1', 'Eliminar', 28),
(114, '1', 'Ver', 29),
(115, '1', 'Crear', 29),
(116, '1', 'Modificar', 29),
(117, '1', 'Eliminar', 29),
(118, '1', 'Ver', 30),
(119, '1', 'Crear', 30),
(120, '1', 'Modificar', 30),
(121, '1', 'Eliminar', 30),
(122, '1', 'Ver', 31),
(123, '1', 'Crear', 31),
(124, '1', 'Eliminar', 31),
(125, '1', 'Modificar', 31),
(126, '1', 'Ver', 32),
(127, '1', 'Crear', 32),
(128, '1', 'Eliminar', 32),
(129, '1', 'Modificar', 32),
(130, '1', 'Crear', 33),
(131, '1', 'Ver', 33),
(132, '1', 'Modificar', 33),
(133, '1', 'Eliminar', 33),
(134, '1', 'Ver', 34),
(135, '1', 'Crear', 34),
(136, '1', 'Modificar', 34),
(137, '1', 'Eliminar', 34),
(138, '1', 'Ver', 35),
(139, '1', 'Crear', 35),
(140, '1', 'Modificar', 35),
(141, '1', 'Eliminar', 35),
(142, '1', 'Ver', 36),
(143, '1', 'Crear', 36),
(144, '1', 'Modificar', 36),
(145, '1', 'Eliminar', 36),
(146, '1', 'Ver', 37),
(147, '1', 'Crear', 37),
(148, '1', 'Modificar', 37),
(149, '1', 'Eliminar', 37),
(150, '1', 'Ver', 38),
(151, '1', 'Crear', 38),
(152, '1', 'Modificar', 38),
(153, '1', 'Eliminar', 38),
(154, '1', 'Ver', 39),
(155, '1', 'Crear', 39),
(156, '1', 'Modificar', 39),
(157, '1', 'Eliminar', 39),
(158, '1', 'Ver', 40),
(159, '1', 'Crear', 40),
(160, '1', 'Modificar', 40),
(161, '1', 'Eliminar', 40),
(162, '1', 'Ver', 41),
(163, '1', 'Crear', 41),
(164, '1', 'Modificar', 41),
(165, '1', 'Eliminar', 41),
(166, '1', 'Ver', 42),
(167, '1', 'Ver', 43),
(168, '1', 'Crear', 43),
(169, '1', 'Modificar', 43),
(170, '1', 'Eliminar', 43),
(171, '1', 'Crear', 44),
(172, '1', 'Ver', 44),
(173, '1', 'Modificar', 44),
(174, '1', 'Eliminar', 44),
(175, '1', 'Ver', 45);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_modulos`
--

CREATE TABLE `seg_modulos` (
  `mod_codigo` int(11) NOT NULL,
  `mod_estado` enum('1','2') COLLATE utf8_spanish2_ci NOT NULL COMMENT 'Este es el estado de un registro. 1 = Activo, 2 = Inactivo.',
  `mod_nombre` varchar(200) COLLATE utf8_spanish2_ci NOT NULL COMMENT 'nombre del modulo',
  `mod_orden` int(11) NOT NULL COMMENT 'Numero en orden ascendente para el orden en el que se ven los modulos. ',
  `mod_tipo` enum('1','2') COLLATE utf8_spanish2_ci NOT NULL COMMENT 'Contiene el tipo de modulo. 1 = Carpeta, 2 = Modulo.',
  `mod_ubicacion` varchar(300) COLLATE utf8_spanish2_ci DEFAULT NULL COMMENT 'Contiene la  ubicación o ruta del aplicativo.',
  `mod_icon` varchar(200) COLLATE utf8_spanish2_ci DEFAULT NULL COMMENT 'Contiene código HTML que genera el icono de un módulo y/o carpeta.',
  `mod_desktop` tinyint(1) DEFAULT NULL COMMENT 'Acceso directo del módulo en el panel principal de la aplicación. ',
  `mod_padre` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seg_modulos`
--

INSERT INTO `seg_modulos` (`mod_codigo`, `mod_estado`, `mod_nombre`, `mod_orden`, `mod_tipo`, `mod_ubicacion`, `mod_icon`, `mod_desktop`, `mod_padre`) VALUES
(1, '1', 'Clientes', 1, '2', '', '', 0, 0),
(2, '1', 'Actividades', 2, '2', '', '', 0, 0),
(3, '1', 'Creditos', 3, '2', '', '', 0, 0),
(4, '1', 'relacion-aprendiz', 41, '2', '', '', 0, 0),
(5, '1', 'Proveedores', 11, '2', '', '', 0, 0),
(6, '1', 'Vendedores', 12, '2', '', '', 0, 0),
(7, '1', 'Mantenimientos', 13, '2', '', '', 0, 0),
(8, '1', 'Sistema', 21, '2', '', '', 0, 0),
(9, '1', 'Documentos', 17, '2', '', '', 0, 0),
(10, '1', 'Ubicaciones', 17, '2', '', '', 0, 0),
(11, '1', 'Instructores', 15, '2', '', '', 0, 0),
(12, '1', 'Fichas', 14, '2', '', '', 0, 0),
(13, '1', 'Pagos', 18, '2', '', '', 0, 0),
(14, '1', 'Barrios', 19, '2', '', '', 0, 0),
(15, '1', 'Ingreso Articulos', 5, '2', '', '', 0, 0),
(16, '1', 'Familias', 6, '2', '', '', 0, 0),
(17, '1', 'Lineas', 7, '2', '', '', 0, 0),
(18, '1', 'Marcas', 8, '2', '', '', 0, 0),
(19, '1', 'Grupos', 9, '2', '', '', 0, 0),
(20, '1', 'Unidades', 10, '2', '', '', 0, 0),
(21, '1', 'Usuarios', 22, '2', '', '', 0, 0),
(22, '1', 'Roles', 23, '2', '', '', 0, 0),
(23, '1', 'Permisos', 24, '2', '', '', 0, 0),
(24, '1', 'Reportes', 100, '2', '', '', 0, 0),
(25, '1', 'Reporte inasistencias', 26, '2', '', '', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_permisos`
--

CREATE TABLE `seg_permisos` (
  `seg_accion` int(11) DEFAULT NULL COMMENT 'FK que apunta al campo ACC_CODIGO de la tabla SEG_ACCIONES.',
  `seg_roles` int(11) DEFAULT NULL COMMENT 'FK que apunta al campo ROL_CODIGO de la tabla SEG_ROLES. '
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seg_permisos`
--

INSERT INTO `seg_permisos` (`seg_accion`, `seg_roles`) VALUES
(1, 1),
(2, 1),
(3, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1),
(41, 1),
(42, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(47, 1),
(49, 1),
(50, 1),
(51, 1),
(53, 1),
(54, 1),
(55, 1),
(57, 1),
(58, 1),
(59, 1),
(48, 1),
(52, 1),
(56, 1),
(60, 1),
(61, 1),
(62, 1),
(63, 1),
(64, 1),
(65, 1),
(66, 1),
(67, 1),
(68, 1),
(69, 1),
(70, 1),
(71, 1),
(72, 1),
(73, 1),
(74, 1),
(75, 1),
(76, 1),
(77, 1),
(78, 1),
(79, 1),
(80, 1),
(81, 1),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 1),
(87, 1),
(88, 1),
(89, 1),
(90, 1),
(91, 1),
(92, 1),
(93, 1),
(94, 1),
(95, 1),
(96, 1),
(97, 1),
(98, 1),
(99, 1),
(100, 1),
(101, 1),
(102, 1),
(103, 1),
(104, 1),
(105, 1),
(106, 1),
(107, 1),
(108, 1),
(109, 1),
(110, 1),
(111, 1),
(112, 1),
(113, 1),
(114, 1),
(115, 1),
(116, 1),
(117, 1),
(118, 1),
(119, 1),
(120, 1),
(121, 1),
(122, 1),
(123, 1),
(124, 1),
(125, 1),
(126, 1),
(127, 1),
(128, 1),
(129, 1),
(130, 1),
(131, 1),
(132, 1),
(133, 1),
(134, 1),
(135, 1),
(136, 1),
(137, 1),
(138, 1),
(139, 1),
(140, 1),
(141, 1),
(142, 1),
(143, 1),
(144, 1),
(145, 1),
(146, 1),
(147, 1),
(148, 1),
(149, 1),
(150, 1),
(151, 1),
(152, 1),
(153, 1),
(154, 1),
(155, 1),
(156, 1),
(157, 1),
(158, 1),
(159, 1),
(160, 1),
(161, 1),
(162, 1),
(163, 1),
(164, 1),
(165, 1),
(166, 1),
(167, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_roles`
--

CREATE TABLE `seg_roles` (
  `rol_codigo` int(11) NOT NULL,
  `rol_estado` enum('1','2') COLLATE utf8_spanish2_ci NOT NULL COMMENT 'Este es el estado de un registro. 1 = Activo, 2 = Inactivo.',
  `rol_nombre` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL COMMENT 'Contiene el nombres del grupo.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seg_roles`
--

INSERT INTO `seg_roles` (`rol_codigo`, `rol_estado`, `rol_nombre`) VALUES
(1, '1', 'Administrador'),
(2, '1', 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_rolesusuarios`
--

CREATE TABLE `seg_rolesusuarios` (
  `rol_usuarios` int(20) NOT NULL COMMENT 'Contiene el codigo del usuario al que pertenece el rol, es un fk del campo usu_codigo de la tabla seg_usuarios.',
  `rol_roles` int(20) NOT NULL COMMENT 'Contiene el codigo del rol, es una fk del campo rol_codigo de la tabla seg_roles.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seg_rolesusuarios`
--

INSERT INTO `seg_rolesusuarios` (`rol_usuarios`, `rol_roles`) VALUES
(1, 1),
(9, 2),
(10, 2),
(11, 2),
(12, 1),
(13, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seg_usuarios`
--

CREATE TABLE `seg_usuarios` (
  `usu_codigo` int(11) NOT NULL,
  `usu_estado` int(11) NOT NULL COMMENT 'Este es el estado de un registro. 1 = Activo, 2 = Inactivo.',
  `usu_usuario` varchar(250) COLLATE utf8_spanish2_ci NOT NULL COMMENT 'Este campo contiene el nickname de un usuario.',
  `usu_password` varchar(100) COLLATE utf8_spanish2_ci NOT NULL COMMENT 'Contraseña del usuario.',
  `usu_nombres` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `usu_apellidos` varchar(100) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `usu_email` varchar(300) COLLATE utf8_spanish2_ci DEFAULT NULL,
  `usu_tercero` int(11) NOT NULL COMMENT 'Codigo del tercero, hace referencia al campo ''''cli_id'''' de la tabla ''''clientes'''' ',
  `usu_tipo` varchar(10) COLLATE utf8_spanish2_ci DEFAULT NULL COMMENT 'tipo tercero'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `seg_usuarios`
--

INSERT INTO `seg_usuarios` (`usu_codigo`, `usu_estado`, `usu_usuario`, `usu_password`, `usu_nombres`, `usu_apellidos`, `usu_email`, `usu_tercero`, `usu_tipo`) VALUES
(1, 1, 'admin', '202cb962ac59075b964b07152d234b70', NULL, NULL, NULL, 0, NULL),
(9, 2, '12', 'c20ad4d76fe97759aa27a0c99bff6710', 'Aracelis', 'Cantillo', 'xelis@gmail.com', 12, 'CLI'),
(10, 2, '120', 'da4fb5c6e93e74d3df8527599fa62642', 'Wendy', 'trujillo', 'wen@gj.com', 13, 'CLI'),
(11, 1, '1', 'c4ca4238a0b923820dcc509a6f75849b', 'Viviana', 'Jimenes', 'soy@d.com', 14, 'CLI'),
(12, 1, 'señora', '1e48c4420b7073bc11916c6c1de226bb', 'NA', 'NA', 'No aplica', 0, NULL),
(13, 2, '13', 'c51ce410c124a10e0db5e4b97fc2af39', 'Karen', 'Ruiz', 'kel@gmail.com', 15, 'CLI');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terceros`
--

CREATE TABLE `terceros` (
  `ter_id` int(11) NOT NULL COMMENT 'codigo autoincremental de la tabla ',
  `ter_tipo` varchar(45) NOT NULL COMMENT 'tipo de tercero',
  `ter_identificacion` varchar(45) DEFAULT NULL,
  `ter_pnombre` varchar(45) NOT NULL COMMENT 'primer nombre del cliente requerido*',
  `ter_snombre` varchar(45) DEFAULT NULL COMMENT 'segundo nombre del cliente',
  `ter_papellido` varchar(45) DEFAULT NULL COMMENT 'primer apellido del cliente',
  `ter_sapellido` varchar(45) DEFAULT NULL COMMENT 'segundo apellido del cliente',
  `ter_telefono1` varchar(45) DEFAULT NULL COMMENT 'numero telefonico del cliente\nvarchar porque puede contener una extension',
  `ter_telefono2` varchar(45) DEFAULT NULL COMMENT 'numero telefonico del cliente\nvarchar porque puede contener una extension',
  `ter_direccionreside` varchar(60) DEFAULT NULL COMMENT 'direccion de residencia',
  `ter_direcciontrabajo` varchar(60) DEFAULT NULL COMMENT 'direccion de lugar de trabajo',
  `ter_correo` varchar(100) DEFAULT NULL COMMENT 'correo del cliente',
  `ter_estado` enum('A','*') DEFAULT NULL COMMENT 'estado del cliente \nA activo\n* inactivo',
  `ter_usucrea` varchar(45) DEFAULT NULL,
  `ter_feccrea` datetime DEFAULT NULL,
  `ter_usumod` varchar(45) DEFAULT NULL,
  `ter_fecmod` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `terceros`
--

INSERT INTO `terceros` (`ter_id`, `ter_tipo`, `ter_identificacion`, `ter_pnombre`, `ter_snombre`, `ter_papellido`, `ter_sapellido`, `ter_telefono1`, `ter_telefono2`, `ter_direccionreside`, `ter_direcciontrabajo`, `ter_correo`, `ter_estado`, `ter_usucrea`, `ter_feccrea`, `ter_usumod`, `ter_fecmod`) VALUES
(12, 'CLI', '12', 'Aracelis', '', 'Cantillo', '', '1', '1', '1', '1', 'xelis@gmail.com', 'A', 'admin', '2018-06-11 17:05:04', NULL, NULL),
(13, 'CLI', '120', 'Wendy', 'Johana', 'trujillo', 'magallanes', '1', '1', '1', '1', 'wen@gj.com', 'A', 'admin', '2018-06-11 17:06:19', NULL, NULL),
(14, 'CLI', '1', 'Viviana', '', 'Jimenes', '', '1', '1', '1', '1', 'soy@d.com', 'A', 'admin', '2018-06-11 17:22:37', NULL, NULL),
(15, 'CLI', '13', 'Karen', 'Elena', 'Ruiz', 'Tapia', '11', '11', '11', '11', 'kel@gmail.com', 'A', 'admin', '2018-06-11 19:00:31', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  ADD PRIMARY KEY (`bit_id`),
  ADD KEY `cli_id_fk_idx` (`ter_id`);

--
-- Indices de la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD PRIMARY KEY (`cre_id`),
  ADD KEY `cli_id_fk_idx` (`ter_id`),
  ADD KEY `ter_id(dds)_idx` (`ter_id(dds)`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`fac_id`),
  ADD KEY `pag_id_fk_idx` (`pag_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`pag_id`),
  ADD KEY `cre_id_fk_idx` (`cre_id`);

--
-- Indices de la tabla `seg_acciones`
--
ALTER TABLE `seg_acciones`
  ADD PRIMARY KEY (`acc_codigo`);

--
-- Indices de la tabla `seg_modulos`
--
ALTER TABLE `seg_modulos`
  ADD PRIMARY KEY (`mod_codigo`);

--
-- Indices de la tabla `seg_permisos`
--
ALTER TABLE `seg_permisos`
  ADD KEY `seg_roles_fk_idx` (`seg_roles`),
  ADD KEY `seg_accion_fk2_idx` (`seg_accion`);

--
-- Indices de la tabla `seg_roles`
--
ALTER TABLE `seg_roles`
  ADD PRIMARY KEY (`rol_codigo`);

--
-- Indices de la tabla `seg_rolesusuarios`
--
ALTER TABLE `seg_rolesusuarios`
  ADD KEY `rol_usuario_fk_idx` (`rol_usuarios`),
  ADD KEY `rol_roles_fk_idx` (`rol_roles`);

--
-- Indices de la tabla `seg_usuarios`
--
ALTER TABLE `seg_usuarios`
  ADD PRIMARY KEY (`usu_codigo`);

--
-- Indices de la tabla `terceros`
--
ALTER TABLE `terceros`
  ADD PRIMARY KEY (`ter_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  MODIFY `bit_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'codigo autoincremental';

--
-- AUTO_INCREMENT de la tabla `creditos`
--
ALTER TABLE `creditos`
  MODIFY `cre_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'codigo autoincremental de la tabla';

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `fac_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'codigo autoincremental de la tabla';

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `pag_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'codigo autoincremental de la tabla';

--
-- AUTO_INCREMENT de la tabla `seg_acciones`
--
ALTER TABLE `seg_acciones`
  MODIFY `acc_codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=176;

--
-- AUTO_INCREMENT de la tabla `seg_modulos`
--
ALTER TABLE `seg_modulos`
  MODIFY `mod_codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `seg_roles`
--
ALTER TABLE `seg_roles`
  MODIFY `rol_codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `seg_usuarios`
--
ALTER TABLE `seg_usuarios`
  MODIFY `usu_codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `terceros`
--
ALTER TABLE `terceros`
  MODIFY `ter_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'codigo autoincremental de la tabla ', AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bitacoras`
--
ALTER TABLE `bitacoras`
  ADD CONSTRAINT `cli_id_fk1` FOREIGN KEY (`ter_id`) REFERENCES `terceros` (`ter_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD CONSTRAINT `cli_id_fk` FOREIGN KEY (`ter_id`) REFERENCES `terceros` (`ter_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `ter_id(dds)` FOREIGN KEY (`ter_id(dds)`) REFERENCES `terceros` (`ter_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `pag_id_fk` FOREIGN KEY (`pag_id`) REFERENCES `pagos` (`pag_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `cre_id_fk` FOREIGN KEY (`cre_id`) REFERENCES `creditos` (`cre_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `seg_permisos`
--
ALTER TABLE `seg_permisos`
  ADD CONSTRAINT `seg_accion_fk2` FOREIGN KEY (`seg_accion`) REFERENCES `seg_acciones` (`acc_codigo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `seg_roles_fk` FOREIGN KEY (`seg_roles`) REFERENCES `seg_roles` (`rol_codigo`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `seg_rolesusuarios`
--
ALTER TABLE `seg_rolesusuarios`
  ADD CONSTRAINT `rol_roles_fk` FOREIGN KEY (`rol_roles`) REFERENCES `seg_roles` (`rol_codigo`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `rol_usuario_fk` FOREIGN KEY (`rol_usuarios`) REFERENCES `seg_usuarios` (`usu_codigo`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
