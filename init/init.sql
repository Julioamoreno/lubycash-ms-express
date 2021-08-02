CREATE DATABASE IF NOT EXISTS lubycash;
GRANT ALL PRIVILEGES ON lubycash.* TO 'armando'@'%' IDENTIFIED BY '12341234';
GRANT ALL PRIVILEGES ON lubycash.* TO 'armando'@'localhost' IDENTIFIED BY '12341234';
ALTER USER 'armando'@'localhost' IDENTIFIED WITH mysql_native_password BY '12341234';
ALTER USER 'armando'@'%' IDENTIFIED WITH mysql_native_password BY '12341234';
flush privileges;
set global sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';