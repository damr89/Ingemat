
-- CREAMOS Y USAMOS LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS INGEMAT_P1;
USE INGEMAT_P1;

-- CLIENTES (Natural o Jurídico)
CREATE TABLE Cliente (
    ID_Clien SMALLINT AUTO_INCREMENT PRIMARY KEY,
    Tipo_Cliente ENUM('Natural', 'Juridico') NOT NULL,
    Tipo_Empresa ENUM('Privada', 'Estatal') DEFAULT NULL,
    Nom_Cli VARCHAR(100) NOT NULL,
    Apell_Cli VARCHAR(100),            
    RUC VARCHAR(11) UNIQUE,
    DNI INT UNSIGNED UNIQUE,
    Correo VARCHAR(50),
    Direccion VARCHAR(100),
    CHECK (
        (Tipo_Cliente = 'Natural' AND Tipo_Empresa IS NULL AND DNI IS NOT NULL AND Apell_Cli IS NOT NULL)
        OR
        (Tipo_Cliente = 'Juridico' AND Tipo_Empresa IS NOT NULL AND DNI IS NULL AND Apell_Cli IS NULL)
    )
);

-- EMPRESAS SOLICITANTES
CREATE TABLE Empresa (
    ID_EmpresaSoli SMALLINT AUTO_INCREMENT PRIMARY KEY,
    Nom_Empresa VARCHAR(100),
    N_Ruc20 VARCHAR(11),
    Direccion VARCHAR(100),
    Distrito VARCHAR(50),
    Provincia VARCHAR(50),
    Departamento VARCHAR(50)
); 

-- CATEGORÍAS DE FORMATOS
CREATE TABLE Categoria_Formatos (
    ID_Cat_For SMALLINT AUTO_INCREMENT PRIMARY KEY,
    Nom_CatF VARCHAR(100)
);

-- FORMATOS
CREATE TABLE Formatos (
    ID_Formatos SMALLINT AUTO_INCREMENT PRIMARY KEY,
    ID_Cat_For SMALLINT NOT NULL,
    Nom_For VARCHAR(100),
    Precio DECIMAL(7,2),
    SubFormatos VARCHAR(350),
    FOREIGN KEY (ID_Cat_For) REFERENCES Categoria_Formatos(ID_Cat_For)
);

-- COTIZACIONES
CREATE TABLE Cotizacion (
    ID_Coti SMALLINT AUTO_INCREMENT PRIMARY KEY,
    Motivo VARCHAR(100),
    ID_Clien SMALLINT NOT NULL,
    Fec_Coti DATE NOT NULL,
    Tiempo_Ejec SMALLINT,
    FOREIGN KEY (ID_Clien) REFERENCES Cliente(ID_Clien)
);

-- RELACIÓN COTIZACIÓN - CATEGORÍA
CREATE TABLE Cotizacion_Categoria (
    ID_Coti SMALLINT,
    ID_Cat_For SMALLINT,
    PRIMARY KEY (ID_Coti, ID_Cat_For),
    FOREIGN KEY (ID_Coti) REFERENCES Cotizacion(ID_Coti),
    FOREIGN KEY (ID_Cat_For) REFERENCES Categoria_Formatos(ID_Cat_For)
);

-- GASTOS ADICIONALES
CREATE TABLE Gas_Adic (
    ID_Gas_Adic SMALLINT AUTO_INCREMENT PRIMARY KEY,
    Des_Adic VARCHAR(250),
    Precio DECIMAL(7,2),
    ID_Coti SMALLINT NOT NULL,
    FOREIGN KEY (ID_Coti) REFERENCES Cotizacion(ID_Coti)
);

-- ORDEN DE SERVICIO
CREATE TABLE Orden_Servicio (
    ID_Orden_Ser SMALLINT AUTO_INCREMENT PRIMARY KEY,
    ID_EmpresaSoli SMALLINT NOT NULL,
    Unidad_Ejecutora VARCHAR(100),
    Titulo_Proyect VARCHAR(300),
    Representante VARCHAR(100),
    FOREIGN KEY (ID_EmpresaSoli) REFERENCES Empresa(ID_EmpresaSoli)
);

-- FACTURA
CREATE TABLE Factura (
    ID_Factura SMALLINT AUTO_INCREMENT PRIMARY KEY,
    Medio_Pago VARCHAR(50)
);

-- PROYECTO CENTRAL
CREATE TABLE Proyecto (
    ID_Proyect SMALLINT AUTO_INCREMENT PRIMARY KEY,
    ID_Coti SMALLINT NOT NULL UNIQUE,
    ID_Orden_Ser SMALLINT UNIQUE,
    ID_Factura SMALLINT UNIQUE,
    Estado VARCHAR(30),
    Informe_URL VARCHAR(255),
    FOREIGN KEY (ID_Coti) REFERENCES Cotizacion(ID_Coti),
    FOREIGN KEY (ID_Orden_Ser) REFERENCES Orden_Servicio(ID_Orden_Ser),
    FOREIGN KEY (ID_Factura) REFERENCES Factura(ID_Factura)
);
