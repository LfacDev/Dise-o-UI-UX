CREATE DATABASE Viatge_BD;
USE Viatge_BD;

-- Usuario del Sistema
CREATE TABLE Usuario(
ID_Usuario INT PRIMARY KEY AUTO_INCREMENT,
Nombre_Usuario VARCHAR(45),
Apellido_Usuario VARCHAR(45),
Pais_Usuario VARCHAR(45),
Telefono_Usuario VARCHAR(20),
Correo_Usuario VARCHAR(95),
Contraseña VARCHAR(255)
);

-- Ubicacion de Hotel y de la Actividad
CREATE TABLE Ubicacion (
  ID_Ubicacion INT PRIMARY KEY AUTO_INCREMENT,
  Pais_Ubicacion VARCHAR(100),
  Ciudad_Ubicacion VARCHAR(100),
  Direccion_Ubicacion VARCHAR(200),
  Latitud_Ubicacion DOUBLE(10, 8),
  Longitud_Ubicacion DOUBLE(11, 8)
);

-- Principal detalles habitacion
CREATE TABLE Detalles(
ID_Detalle INT PRIMARY KEY AUTO_INCREMENT,
Nombre_Detalle VARCHAR(100),
Descripcion_Detalle VARCHAR(100)
);

-- Tipo de Habitacion
CREATE TABLE Tipo_Habitacion(
ID_TipoHabitacion INT PRIMARY KEY AUTO_INCREMENT,
Nombre_TipoHabitacion VARCHAR(100),
Descripcion_TipoHabitacion VARCHAR(100)
);

-- Tipo de Hotel
CREATE TABLE Tipo_Hotel(
ID_TipoHotel INT PRIMARY KEY AUTO_INCREMENT,
Nombre_TipoHotel VARCHAR(100),
Descripcion_TipoHotel VARCHAR(100)
);

-- Tipo de Actividad Turistica
CREATE TABLE Tipo_ActividadTur(
ID_TipoActividadTur INT PRIMARY KEY AUTO_INCREMENT,
Nombre_TipoActividadTur VARCHAR(100),
Descripcion_TipoActividadTur VARCHAR(100)
);

-- Tipo de Huesped
CREATE TABLE Tipo_Huesped(
ID_TipoHuesped INT PRIMARY KEY AUTO_INCREMENT,
Nombre_TipoHuesped VARCHAR(100),
Descripcion_TipoHuesped VARCHAR(100)
);

-- Tipo de Pago
CREATE TABLE Tipo_Pago(
ID_TipoPago INT PRIMARY KEY AUTO_INCREMENT,
Nombre_TipoPago VARCHAR(100),
Descripcion_TipoPago VARCHAR(100)
);
-- Servicios
CREATE TABLE Servicios(
ID_Servicios INT PRIMARY KEY AUTO_INCREMENT,
Nombre_Servicio VARCHAR(100),
Descripcion_Servicio VARCHAR(100)
);

-- Huesped
CREATE TABLE Huesped(
ID_Huesped INT PRIMARY KEY AUTO_INCREMENT,
Cantidad_Huesped INT,
Edad_Huesped INT,
FK_TipoHuesped INT,
FOREIGN KEY (FK_TipoHuesped) REFERENCES Tipo_Huesped(ID_TipoHuesped)
);

-- Hotel
CREATE TABLE Hotel(
ID_Hotel INT PRIMARY KEY AUTO_INCREMENT,
Nombre_Hotel VARCHAR(250),
Descripcion_Hotel VARCHAR(500),
Imagen_Hotel VARCHAR(300),
EsFavorito_Hotel BOOLEAN DEFAULT FALSE,
FK_TipoHotel INT,
FK_Ubicacion INT,
FOREIGN KEY (FK_TipoHotel) REFERENCES Tipo_Hotel(ID_TipoHotel),
FOREIGN KEY (FK_Ubicacion) REFERENCES Ubicacion(ID_Ubicacion)
);


-- Habitacion
CREATE TABLE Habitacion(
ID_Habitacion INT PRIMARY KEY AUTO_INCREMENT,
Descripcion_Habitacion VARCHAR(300),
Precio_Habitacion DECIMAL(10, 2),
Tamaño_Habitacion FLOAT,
FK_TipoHabitacion INT,
FK_Hotel INT,
FOREIGN KEY (FK_TipoHabitacion) REFERENCES Tipo_Habitacion(ID_TipoHabitacion),
FOREIGN KEY (FK_Hotel) REFERENCES Hotel(ID_Hotel)
);

-- Imagenes de la Habitacion
CREATE TABLE Imagen_Habitacion(
ID_ImagenHabitacion INT PRIMARY KEY AUTO_INCREMENT,
URL_ImagenHabitacion VARCHAR(300),
FK_Habitacion INT,
FOREIGN KEY (FK_Habitacion) REFERENCES Habitacion(ID_Habitacion)
);

-- Detalle Habitacion 
CREATE TABLE Detalle_Habitacion(
ID_DetalleHabitacion INT PRIMARY KEY AUTO_INCREMENT,
FK_Habitacion INT,
FK_Detalle INT,
FOREIGN KEY (FK_Habitacion) REFERENCES Habitacion(ID_Habitacion),
FOREIGN KEY (FK_Detalle) REFERENCES Detalles(ID_Detalle)
);

-- Servicios Habitacion
CREATE TABLE Servicios_Habitacion(
ID_ServiciosHabitacion INT PRIMARY KEY AUTO_INCREMENT,
FK_Habitacion INT,
FK_Servicios INT,
FOREIGN KEY (FK_Habitacion) REFERENCES Habitacion(ID_Habitacion),
FOREIGN KEY (FK_Servicios) REFERENCES Servicios(ID_Servicios)
);

-- Servicios Hotel
CREATE TABLE Servicios_Hotel(
ID_ServiciosHotel INT PRIMARY KEY AUTO_INCREMENT,
FK_Hotel INT,
FK_Servicios INT,
FOREIGN KEY (FK_Hotel) REFERENCES Hotel(ID_Hotel),
FOREIGN KEY (FK_Servicios) REFERENCES Servicios(ID_Servicios)	
);

-- Reserva de Hotel
CREATE TABLE Reserva_Hotel(
ID_ReservaHotel INT PRIMARY KEY AUTO_INCREMENT,
Fechallegada DATETIME,
FechaSalida DATETIME,
TotalPagar_Hotel DECIMAL(8, 4),
FK_Hotel INT,
FK_Huesped INT,
FK_Usuario INT,
FK_TipoPago INT,
FOREIGN KEY (FK_Hotel) REFERENCES Hotel(ID_Hotel),
FOREIGN KEY (FK_Huesped) REFERENCES Huesped(ID_Huesped),
FOREIGN KEY (FK_Usuario) REFERENCES Usuario(ID_Usuario),
FOREIGN KEY (FK_TipoPago) REFERENCES Tipo_Pago(ID_TipoPago)
);

-- Reserva de habitacion 
CREATE TABLE Reserva_Habitacion(
ID_ReservaHabitacion INT PRIMARY KEY AUTO_INCREMENT,
Cantidad INT,
FK_ReservaHotel INT,
FK_Habitacion INT,
FOREIGN KEY (FK_Habitacion) REFERENCES Habitacion(ID_Habitacion),
FOREIGN KEY (FK_ReservaHotel) REFERENCES Reserva_Hotel(ID_ReservaHotel)
);

-- Actividades Turisticas
CREATE TABLE Actividad_Turistica(
ID_ActividadTuristica INT PRIMARY KEY AUTO_INCREMENT,
Nombre_Actividad VARCHAR(100),
Descripcion_Actividad VARCHAR(500),
Precio_Actividad DECIMAL(10,2),
FK_TipoActividadTur INT,
FK_Ubicacion INT,
FOREIGN KEY (FK_TipoActividadTur) REFERENCES Tipo_ActividadTur(ID_TipoActividadTur),
FOREIGN KEY (FK_Ubicacion) REFERENCES Ubicacion(ID_Ubicacion)
);

-- Imagenes de la Actividad
CREATE TABLE Imagen_Actividad(
ID_ImagenActividad INT PRIMARY KEY AUTO_INCREMENT,
URL_ImagenActividad VARCHAR(300),
FK_ActividadTuristica INT,
FOREIGN KEY (FK_ActividadTuristica) REFERENCES Actividad_Turistica(ID_ActividadTuristica)
);

-- Reserva de Actividad
CREATE TABLE Reserva_Actividad(
ID_ReservaActividad INT PRIMARY KEY AUTO_INCREMENT,
Fecha DATE,
Hora TIME,
TotalPagar_Actividad DECIMAL(10, 2),
FK_ActividadTuristica INT,
FK_Huesped INT,
FK_Usuario INT,
FK_TipoPago INT,
FOREIGN KEY (FK_ActividadTuristica) REFERENCES Actividad_Turistica(ID_ActividadTuristica),
FOREIGN KEY (FK_Huesped) REFERENCES Huesped(ID_Huesped),
FOREIGN KEY (FK_Usuario) REFERENCES Usuario(ID_Usuario),
FOREIGN KEY (FK_TipoPago) REFERENCES Tipo_Pago(ID_TipoPago)
);

-- Reseñas y Calificaciones
CREATE TABLE Calificaciones(
ID_Calificaciones INT PRIMARY KEY AUTO_INCREMENT,
Calificacion FLOAT,
Comentario VARCHAR(250),
FK_Usuario INT,
FK_Hotel INT,
FK_ActividadTuristica INT,
FOREIGN KEY (FK_Usuario) REFERENCES Usuario(ID_Usuario),
FOREIGN KEY (FK_Hotel) REFERENCES Hotel(ID_Hotel),
FOREIGN KEY (FK_ActividadTuristica) REFERENCES Actividad_Turistica(ID_ActividadTuristica)
);

-- _____________- INSERSION DE DATOS ___________________

-- Insertar datos en la tabla Usuario
INSERT INTO Usuario (Nombre_Usuario, Apellido_Usuario, Pais_Usuario, Telefono_Usuario, Correo_Usuario, Contraseña)
VALUES 
('Juan', 'Pérez', 'Colombia', '3001234567', 'juan.perez@example.com', 'password123'),
('Ana', 'García', 'México', '3109876543', 'ana.garcia@example.com', 'password456');

-- Insertar datos en la tabla Ubicacion
INSERT INTO Ubicacion (Pais_Ubicacion, Ciudad_Ubicacion, Direccion_Ubicacion, Latitud_Ubicacion, Longitud_Ubicacion)
VALUES 
('Colombia', 'Bogotá', 'Calle 100 # 10-10', 4.60971, -74.08175),
('México', 'Ciudad de México', 'Avenida Reforma 123', 19.43261, -99.13321);

-- Insertar datos en la tabla Detalles
INSERT INTO Detalles (Nombre_Detalle, Descripcion_Detalle)
VALUES 
('Aire Acondicionado', 'Sistema de aire acondicionado en la habitación'),
('Wi-Fi', 'Acceso gratuito a internet');

-- Insertar datos en la tabla Tipo_Habitacion
INSERT INTO Tipo_Habitacion (Nombre_TipoHabitacion, Descripcion_TipoHabitacion)
VALUES 
('Individual', 'Habitación para una sola persona'),
('Doble', 'Habitación para dos personas');

-- Insertar datos en la tabla Tipo_Hotel
INSERT INTO Tipo_Hotel (Nombre_TipoHotel, Descripcion_TipoHotel)
VALUES 
('Boutique', 'Hotel con un estilo único y exclusivo'),
('Resort', 'Hotel con servicios completos para vacaciones');

-- Insertar datos en la tabla Tipo_ActividadTur
INSERT INTO Tipo_ActividadTur (Nombre_TipoActividadTur, Descripcion_TipoActividadTur)
VALUES 
('Tour Cultural', 'Visitas guiadas a lugares históricos y culturales'),
('Aventura', 'Actividades al aire libre y extremas');

-- Insertar datos en la tabla Tipo_Huesped
INSERT INTO Tipo_Huesped (Nombre_TipoHuesped, Descripcion_TipoHuesped)
VALUES 
('Adulto', 'Persona mayor de 18 años'),
('Niño', 'Persona menor de 18 años');

-- Insertar datos en la tabla Tipo_Pago
INSERT INTO Tipo_Pago (Nombre_TipoPago, Descripcion_TipoPago)
VALUES 
('Tarjeta de Crédito', 'Pago realizado mediante tarjeta de crédito'),
('Efectivo', 'Pago realizado en efectivo');

-- Insertar datos en la tabla Servicios
INSERT INTO Servicios (Nombre_Servicio, Descripcion_Servicio)
VALUES 
('Gimnasio', 'Acceso al gimnasio del hotel'),
('Spa', 'Servicios de spa y bienestar');

-- Insertar datos en la tabla Huesped
INSERT INTO Huesped (Cantidad_Huesped, Edad_Huesped, FK_TipoHuesped)
VALUES 
(1, 30, 1),  -- Adulto
(2, 5, 2);   -- Niño

-- Insertar datos en la tabla Hotel
INSERT INTO Hotel (Nombre_Hotel, Descripcion_Hotel, Imagen_Hotel, EsFavorito_Hotel, FK_TipoHotel, FK_Ubicacion)
VALUES 
('Hotel Elegante', 'Un hotel de lujo en el centro de la ciudad', 'imagen1.jpg', TRUE, 1, 1),
('Resort Playa', 'Un resort en la playa con todas las comodidades', 'imagen2.jpg', FALSE, 2, 2);

-- Insertar datos en la tabla Habitacion
INSERT INTO Habitacion (Descripcion_Habitacion, Precio_Habitacion, Tamaño_Habitacion, FK_TipoHabitacion, FK_Hotel)
VALUES 
('Habitación individual con vista al mar', 100.00, 20.00, 1, 1),
('Habitación doble con terraza', 150.00, 30.00, 2, 2);

-- Insertar datos en la tabla Imagen_Habitacion
INSERT INTO Imagen_Habitacion (URL_ImagenHabitacion, FK_Habitacion)
VALUES 
('imagen_habitacion1.jpg', 1),
('imagen_habitacion2.jpg', 2);

-- Insertar datos en la tabla Detalle_Habitacion
INSERT INTO Detalle_Habitacion (FK_Habitacion, FK_Detalle)
VALUES 
(1, 1), -- Aire Acondicionado en la habitación 1
(2, 2); -- Wi-Fi en la habitación 2

-- Insertar datos en la tabla Servicios_Habitacion
INSERT INTO Servicios_Habitacion (FK_Habitacion, FK_Servicios)
VALUES 
(1, 1), -- Gimnasio en la habitación 1
(2, 2); -- Spa en la habitación 2

-- Insertar datos en la tabla Servicios_Hotel
INSERT INTO Servicios_Hotel (FK_Hotel, FK_Servicios)
VALUES 
(1, 1), -- Gimnasio en el hotel 1
(2, 2); -- Spa en el hotel 2

-- Insertar datos en la tabla Reserva_Hotel
INSERT INTO Reserva_Hotel (Fechallegada, FechaSalida, TotalPagar_Hotel, FK_Hotel, FK_Huesped, FK_Usuario)
VALUES 
('2024-09-01 15:00:00', '2024-09-07 11:00:00', 700.00, 1, 1, 1),
('2024-09-10 15:00:00', '2024-09-15 11:00:00', 1050.00, 2, 2, 2);

-- Insertar datos en la tabla Reserva_Habitacion
INSERT INTO Reserva_Habitacion (Cantidad, FK_ReservaHotel, FK_Habitacion)
VALUES 
(1, 1, 1),
(2, 2, 2);

-- Insertar datos en la tabla Actividad_Turistica
INSERT INTO Actividad_Turistica (Nombre_Actividad, Descripcion_Actividad, Precio_Actividad, FK_TipoActividadTur, FK_Ubicacion)
VALUES 
('Visita al Museo', 'Tour guiado por el museo de arte', 50.00, 1, 1),
('Excursión en Aventura', 'Actividad de aventura en la selva', 120.00, 2, 2);

-- Insertar datos en la tabla Imagen_Actividad
INSERT INTO Imagen_Actividad (URL_ImagenActividad, FK_ActividadTuristica)
VALUES 
('imagen_actividad1.jpg', 1),
('imagen_actividad2.jpg', 2);

-- Insertar datos en la tabla Reserva_Actividad
INSERT INTO Reserva_Actividad (Fecha, Hora, TotalPagar_Actividad, FK_ActividadTuristica, FK_Huesped, FK_Usuario)
VALUES 
('2024-09-01', '10:00:00', 50.00, 1, 1, 1),
('2024-09-10', '14:00:00', 120.00, 2, 2, 2);

-- Insertar datos en la tabla Calificaciones
INSERT INTO Calificaciones (Calificacion, Comentario, FK_Usuario, FK_Hotel, FK_ActividadTuristica)
VALUES 
(4.5, 'Excelente hotel con buena atención', 1, 1, NULL),
(5.0, 'Actividad increíble y bien organizada', 2, NULL, 2);
