<?php


return [

    'default' => [
        'namespace' => 'App\\Models',
        'output_path' => app_path('Models'),
        'no_timestamps' => false,
        'date_format' => 'Y-m-d H:i:s',
        'connection' => null,
        'backup' => false,
        'snake_attributes' => true,
        'qualified_tables' => false,
        'use_db_collation' => false,
        'default_string_length' => 191,
        'dbal' => [
            'numeric_types' => [
                'TINYINT',
                'SMALLINT',
                'MEDIUMINT',
                'INT',
                'INTEGER',
                'BIGINT',
                'DECIMAL',
                'DEC',
                'NUMERIC',
                'FIXED',
                'FLOAT',
                'DOUBLE',
                'DOUBLE PRECISION',
                'REAL',
            ],
        ],
    ],

];
