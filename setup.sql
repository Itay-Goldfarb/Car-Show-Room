CREATE USER itaygold WITH PASSWORD 'password';

CREATE DATABASE nodelogin;

GRANT ALL PRIVILEGES ON DATABASE nodelogin TO itaygold;


\c nodelogin
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(200),
    email VARCHAR(200),
    password VARCHAR(200)
);


GRANT ALL PRIVILEGES ON TABLE users TO itaygold;

GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO itaygold;


CREATE TABLE FavoriteCars (
    FavoriteCarID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    CarMake VARCHAR(255) NOT NULL,
    CarModel VARCHAR(255) NOT NULL,
    CarYear INT NOT NULL,
    CarClass VARCHAR(255),
    FuelType VARCHAR(255),
    Drivetrain VARCHAR(255),
    Cylinders INT,
    Transmission VARCHAR(255),
    CityMPG INT,
    HighwayMPG INT,
    CombinationMPG INT,
    FOREIGN KEY (UserID) REFERENCES users(username)
);


GRANT ALL PRIVILEGES ON TABLE favoriteCars TO itaygold;

GRANT USAGE, SELECT ON SEQUENCE favoriteCars_FavoriteCarID_seq TO itaygold;
