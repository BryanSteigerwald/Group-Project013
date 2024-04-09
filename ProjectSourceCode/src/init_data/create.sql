DROP TABLE IF EXISTS users;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS classes;
CREATE TABLE classes(
    class_id VARCHAR(9) PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    info VARCHAR(2000) NOT NULL
);

DROP TABLE IF EXISTS user_classes;
CREATE TABLE user_classes(
    username VARCHAR(50) PRIMARY KEY,
    class_id VARCHAR(9),
    FOREIGN KEY (class_id) REFERENCES classes(class_id),
    FOREIGN KEY (username) REFERENCES users(username)
);
