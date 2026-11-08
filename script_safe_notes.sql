-- ========================================================
-- 1. DDL: CREACIÓN DE LA BASE DE DATOS Y ESTRUCTURAS
-- ========================================================
DROP DATABASE IF EXISTS safe_notes_db;
CREATE DATABASE safe_notes_db;
USE safe_notes_db;

-- Tabla USUARIOS
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

-- Tabla CATEGORIAS
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_usuario_categoria 
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabla NOTAS
CREATE TABLE notas (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    importante BOOLEAN DEFAULT FALSE,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_categoria INT,
    CONSTRAINT fk_usuario_nota 
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_categoria_nota 
        FOREIGN KEY (id_categoria) 
        REFERENCES categorias(id_categoria)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ========================================================
-- 2. DML: PRUEBAS DE LA BASE DE DATOS (INSERT, SELECT, UPDATE, DELETE)
-- ========================================================

-- A. Insertar registros de prueba (Usuarios)
INSERT INTO usuarios (nombre, correo, contrasena) VALUES 
('Andrés Beltrán', 'andres@safenotes.com', 'securepass123'),
('Laura Gómez', 'laura@safenotes.com', 'mypassword456');

-- Insertar categorías de prueba asociadas a los usuarios
INSERT INTO categorias (nombre_categoria, id_usuario) VALUES 
('Estudio', 1),
('Personal', 1),
('Trabajo', 2);

-- Insertar notas de prueba asociadas a usuarios y categorías
INSERT INTO notas (titulo, contenido, importante, id_usuario, id_categoria) VALUES 
('Apuntes de Base de Datos', 'Repasar normalización hasta 3FN y claves foráneas.', TRUE, 1, 1),
('Ideas para la App', 'Agregar modo oscuro en la interfaz de Safe Notes.', FALSE, 1, 2),
('Reunión de equipo', 'Preparar el informe de avance del proyecto de software.', TRUE, 2, 3);

-- B. Consultar registros (Ver usuarios y sus notas)
SELECT u.nombre AS Usuario, n.titulo AS Nota, n.contenido, c.nombre_categoria AS Categoria, n.importante 
FROM usuarios u
JOIN notas n ON u.id_usuario = n.id_usuario
LEFT JOIN categorias c ON n.id_categoria = c.id_categoria;

-- C. Actualizar una nota (Modificar el título o contenido)
UPDATE notas 
SET titulo = 'Apuntes avanzados de Base de Datos', importante = TRUE 
WHERE id_nota = 1;

-- D. Comprobar la consulta después de actualizar
SELECT * FROM notas WHERE id_nota = 1;

-- E. Eliminar un registro de prueba (Eliminar una nota)
DELETE FROM notas WHERE id_nota = 2;

-- Comprobar que la nota fue eliminada y verificar integridad referencial
SELECT * FROM notas;