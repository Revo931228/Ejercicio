USE [master]
GO
/****** Object:  Database [Recibos]    Script Date: 14/11/2022 11:03:50 a. m. ******/
CREATE DATABASE [Recibos]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Recibos', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\Recibos.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Recibos_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\Recibos_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [Recibos] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Recibos].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Recibos] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Recibos] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Recibos] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Recibos] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Recibos] SET ARITHABORT OFF 
GO
ALTER DATABASE [Recibos] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Recibos] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Recibos] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Recibos] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Recibos] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Recibos] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Recibos] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Recibos] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Recibos] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Recibos] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Recibos] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Recibos] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Recibos] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Recibos] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Recibos] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Recibos] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Recibos] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Recibos] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Recibos] SET  MULTI_USER 
GO
ALTER DATABASE [Recibos] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Recibos] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Recibos] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Recibos] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Recibos] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Recibos] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Recibos] SET QUERY_STORE = OFF
GO
USE [Recibos]
GO
/****** Object:  Table [dbo].[Monedas]    Script Date: 14/11/2022 11:03:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Monedas](
	[IdMoneda] [int] IDENTITY(1,1) NOT NULL,
	[NombreMoneda] [varchar](15) NULL,
	[Estatus] [bit] NOT NULL,
 CONSTRAINT [PK_Monedas] PRIMARY KEY CLUSTERED 
(
	[IdMoneda] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Proveedores]    Script Date: 14/11/2022 11:03:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Proveedores](
	[IdProveedor] [int] IDENTITY(1,1) NOT NULL,
	[NombreProveedor] [varchar](100) NOT NULL,
	[Estatus] [bit] NOT NULL,
 CONSTRAINT [PK_Proveedores] PRIMARY KEY CLUSTERED 
(
	[IdProveedor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Recibos]    Script Date: 14/11/2022 11:03:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Recibos](
	[IdRecibo] [int] IDENTITY(1,1) NOT NULL,
	[IdProveedor] [int] NOT NULL,
	[IdMoneda] [int] NOT NULL,
	[Monto] [decimal](18, 4) NOT NULL,
	[Fecha] [smalldatetime] NOT NULL,
	[Comentario] [varchar](max) NULL,
	[IdUsuario] [int] NOT NULL,
	[Estatus] [bit] NOT NULL,
 CONSTRAINT [PK_Recibos] PRIMARY KEY CLUSTERED 
(
	[IdRecibo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuarios]    Script Date: 14/11/2022 11:03:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuarios](
	[IdUsario] [int] IDENTITY(1,1) NOT NULL,
	[NombreUsuario] [varchar](50) NOT NULL,
	[Password] [char](6) NOT NULL,
	[FechaInsert] [smalldatetime] NULL
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Monedas] ON 

INSERT [dbo].[Monedas] ([IdMoneda], [NombreMoneda], [Estatus]) VALUES (1, N'Pesos', 1)
INSERT [dbo].[Monedas] ([IdMoneda], [NombreMoneda], [Estatus]) VALUES (2, N'Dollares', 1)
SET IDENTITY_INSERT [dbo].[Monedas] OFF
GO
SET IDENTITY_INSERT [dbo].[Proveedores] ON 

INSERT [dbo].[Proveedores] ([IdProveedor], [NombreProveedor], [Estatus]) VALUES (1, N'Proveedor 1', 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [NombreProveedor], [Estatus]) VALUES (2, N'Proveedor 2', 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [NombreProveedor], [Estatus]) VALUES (3, N'Proveedor 3', 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [NombreProveedor], [Estatus]) VALUES (4, N'Proveedor 4', 1)
INSERT [dbo].[Proveedores] ([IdProveedor], [NombreProveedor], [Estatus]) VALUES (5, N'Proveedor 5', 1)
SET IDENTITY_INSERT [dbo].[Proveedores] OFF
GO
SET IDENTITY_INSERT [dbo].[Recibos] ON 

INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (2, 1, 1, CAST(152.2500 AS Decimal(18, 4)), CAST(N'2022-11-14T00:00:00' AS SmallDateTime), N'asdasd', 1, 0)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (3, 1, 1, CAST(147.2300 AS Decimal(18, 4)), CAST(N'2022-11-14T00:00:00' AS SmallDateTime), N'ghjgjhghjgjhg', 0, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (4, 4, 1, CAST(1252.0000 AS Decimal(18, 4)), CAST(N'2022-11-13T00:00:00' AS SmallDateTime), N'Prueba de recibos guardados con usuario 2', 2, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (5, 2, 1, CAST(1500.0000 AS Decimal(18, 4)), CAST(N'2022-11-15T00:00:00' AS SmallDateTime), N'prueba fecha', 2, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (6, 4, 2, CAST(1200.0000 AS Decimal(18, 4)), CAST(N'2022-11-14T00:00:00' AS SmallDateTime), N'Prueba', 2, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (7, 5, 1, CAST(1300.0000 AS Decimal(18, 4)), CAST(N'2022-11-14T00:00:00' AS SmallDateTime), N'Proveedor bnuevo', 2, 0)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (8, 1, 2, CAST(1400.0000 AS Decimal(18, 4)), CAST(N'2022-11-14T00:00:00' AS SmallDateTime), N'asd', 2, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (9, 3, 1, CAST(5000.0000 AS Decimal(18, 4)), CAST(N'2022-11-17T00:00:00' AS SmallDateTime), N'asd Prueba de edicion ', 1, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (10, 3, 2, CAST(56000.0000 AS Decimal(18, 4)), CAST(N'2022-11-17T00:00:00' AS SmallDateTime), N'asd', 1, 0)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (11, 4, 2, CAST(12.0000 AS Decimal(18, 4)), CAST(N'2022-12-01T00:00:00' AS SmallDateTime), N'asd', 1, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (12, 4, 1, CAST(89335.0000 AS Decimal(18, 4)), CAST(N'2022-11-14T00:00:00' AS SmallDateTime), N'asd', 1, 1)
INSERT [dbo].[Recibos] ([IdRecibo], [IdProveedor], [IdMoneda], [Monto], [Fecha], [Comentario], [IdUsuario], [Estatus]) VALUES (13, 2, 1, CAST(1111111.0000 AS Decimal(18, 4)), CAST(N'2022-11-14T00:00:00' AS SmallDateTime), N'dsf', 1, 1)
SET IDENTITY_INSERT [dbo].[Recibos] OFF
GO
SET IDENTITY_INSERT [dbo].[Usuarios] ON 

INSERT [dbo].[Usuarios] ([IdUsario], [NombreUsuario], [Password], [FechaInsert]) VALUES (1, N'Administrador', N'admin1', CAST(N'2022-11-10T17:34:00' AS SmallDateTime))
INSERT [dbo].[Usuarios] ([IdUsario], [NombreUsuario], [Password], [FechaInsert]) VALUES (2, N'Usuario2', N'user2 ', CAST(N'2022-11-10T17:34:00' AS SmallDateTime))
SET IDENTITY_INSERT [dbo].[Usuarios] OFF
GO
/****** Object:  StoredProcedure [dbo].[AdminRecibos]    Script Date: 14/11/2022 11:03:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Omar Alonso
-- Create date: 10 de Noviembre 2022
-- Description:	SP de Administracion (INSERT, UPDATE, DELETE) del Sistema de Administracion de Recibos
-- =============================================
CREATE PROCEDURE [dbo].[AdminRecibos]
	@Opcion int,
	@IdProveedor int =  null, 
	@IdMoneda int =  null,  
	@Monto decimal(18,4) = null, 
	@Fecha datetime = null, 
	@Comentario varchar(max) = null, 
	@IdUsuario int = null,
	@IdRecibo int = null
AS
BEGIN
	IF @Opcion = 1 -- Guardado de Recibos
	BEGIN
		BEGIN TRY
			INSERT INTO Recibos (IdProveedor, IdMoneda, Monto, Fecha, Comentario, IdUsuario, Estatus)
			VALUES (@IdProveedor, @IdMoneda, @Monto, @Fecha, @Comentario, @IdUsuario, 1)

			SELECT @@ROWCOUNT AS Resultado;
		END TRY
		BEGIN CATCH
			
		END CATCH;
	END

	IF @Opcion = 2 -- Actualizar datos de Recibos
	BEGIN
		BEGIN TRY
			UPDATE Recibos SET IdMoneda = @IdMoneda,
							   IdProveedor = @IdProveedor,
							   Monto = @Monto,
							   Comentario = @Comentario,
							   Fecha = @Fecha
			WHERE IdRecibo = @IdRecibo
			SELECT @@ROWCOUNT AS Resultado;
		END TRY
		BEGIN CATCH
			
		END CATCH;
	END

	IF @Opcion = 3 -- Actualizar datos de Recibos
	BEGIN
		BEGIN TRY
			UPDATE Recibos SET Estatus = 0
			WHERE IdRecibo = @IdRecibo

			SELECT @@ROWCOUNT AS Resultado;
		END TRY
		BEGIN CATCH
			
		END CATCH;
	END
END
GO
/****** Object:  StoredProcedure [dbo].[ConsultaRecibos]    Script Date: 14/11/2022 11:03:50 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Omar Alonso
-- Create date: 10 de Noviembre 2022
-- Description:	SP de Consulta del Sistema de Administracion de Recibos
-- =============================================
CREATE PROCEDURE [dbo].[ConsultaRecibos]
	@Opcion int,
	@IdRecibo int = null,
	@Usuario int = null,
	@Password char(6) = null,
	@BusquedaProveedor varchar(50) = null

AS
BEGIN
	IF @Opcion = 1 -- Consulta de Usuarios 
	BEGIN
		SELECT IdUsario, 
			   NombreUsuario, 
			   Password 
		FROM Usuarios 
		WHERE IdUsario = @Usuario 
			AND Password = @Password
	END

	IF @Opcion = 2 -- Consulta Proveedores
	BEGIN
		SELECT IdProveedor,
			   NombreProveedor
		FROM Proveedores
		WHERE CAST(IdProveedor as varchar) + NombreProveedor LIKE '%' + ISNULL(@BusquedaProveedor, IdProveedor) + '%'
			AND Estatus = 1
	END

	IF @Opcion = 3 -- Consulta Monedas
	BEGIN
		SELECT IdMoneda,
			   NombreMoneda
		FROM Monedas
		WHERE Estatus = 1
	END

	IF @Opcion = 4 -- Consulta de Recibos
	BEGIN
		SELECT A.IdRecibo,
			   A.IdProveedor,
			   A.IdMoneda,
			   A.Monto,
			   CONVERT(varchar,A.Fecha,1) AS StrFecha,
			   A.Comentario,
			   B.NombreProveedor,
			   C.NombreMoneda,
			   D.NombreUsuario
		FROM Recibos A
			INNER JOIN Proveedores B
				ON A.IdProveedor = B.IdProveedor
			INNER JOIN Monedas C
				ON A.IdMoneda = C.IdMoneda
			INNER JOIN Usuarios D
				ON A.IdUsuario = D.IdUsario
		WHERE A.IdRecibo = CASE WHEN  @IdRecibo <> 0 then ISNULL(@IdRecibo, a.IdRecibo) ELSE a.IdRecibo END
			AND A.IdUsuario = ISNULL(@Usuario, A.IdUsuario)
			AND A.Estatus = 1
	END
END
GO
USE [master]
GO
ALTER DATABASE [Recibos] SET  READ_WRITE 
GO
