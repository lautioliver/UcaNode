-- CreateTable
CREATE TABLE `Perfil` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `emailUcasal` VARCHAR(191) NOT NULL,
    `carrera` VARCHAR(191) NOT NULL DEFAULT 'Ingeniería Informática',
    `anioIngreso` INTEGER NOT NULL,
    `legajo` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Perfil_emailUcasal_key`(`emailUcasal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materia` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NULL,
    `estado` ENUM('CURSANDO', 'PARA_FINALIZAR', 'REGULAR', 'FINALIZADA') NOT NULL DEFAULT 'CURSANDO',
    `cuatrimestre` INTEGER NULL,
    `anio` INTEGER NULL,
    `profesor` VARCHAR(191) NULL,
    `correlativas` VARCHAR(191) NULL,
    `notas` VARCHAR(191) NULL,
    `promocional` BOOLEAN NOT NULL DEFAULT false,
    `semestre` VARCHAR(191) NULL,
    `dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Materia_codigo_key`(`codigo`),
    INDEX `Materia_estado_idx`(`estado`),
    INDEX `Materia_nombre_idx`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entrega` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `tipo` ENUM('TP', 'PARCIAL', 'FINAL') NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `estado` ENUM('PENDIENTE', 'EN_CURSO', 'ENTREGADO') NOT NULL DEFAULT 'PENDIENTE',
    `nota` DOUBLE NULL,
    `recurso` VARCHAR(191) NULL,
    `prioridad` VARCHAR(191) NULL,
    `materiaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Entrega_fecha_idx`(`fecha`),
    INDEX `Entrega_materiaId_idx`(`materiaId`),
    INDEX `Entrega_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Horario` (
    `id` VARCHAR(191) NOT NULL,
    `dia` ENUM('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES') NOT NULL,
    `horaInicio` VARCHAR(191) NOT NULL,
    `horaFin` VARCHAR(191) NOT NULL,
    `modalidad` ENUM('PRESENCIAL', 'VIRTUAL') NOT NULL DEFAULT 'PRESENCIAL',
    `aulaLink` VARCHAR(191) NULL,
    `materiaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinkExterno` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `categoria` ENUM('GOOGLE_DRIVE', 'PLATAFORMA_UCASAL', 'GITHUB', 'OTRO') NOT NULL DEFAULT 'OTRO',
    `favorito` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Entrega` ADD CONSTRAINT `Entrega_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Horario` ADD CONSTRAINT `Horario_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
