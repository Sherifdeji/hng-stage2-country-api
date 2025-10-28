-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `capital` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `population` BIGINT NOT NULL,
    `currency_code` VARCHAR(191) NULL,
    `exchange_rate` DECIMAL(65, 30) NULL,
    `estimated_gdp` DECIMAL(65, 30) NULL,
    `flag_url` VARCHAR(191) NULL,
    `last_refreshed_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `countries_name_key`(`name`),
    INDEX `countries_region_idx`(`region`),
    INDEX `countries_currency_code_idx`(`currency_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL DEFAULT 'global',
    `last_refreshed_at` DATETIME(3) NULL,
    `total_countries` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `ApiStatus_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
