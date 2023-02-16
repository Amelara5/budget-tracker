CREATE TABLE budget(
    id SERIAL PRIMARY KEY,
    amount INTEGER NOT NULL,
    type varchar(255) NOT NULL,
    description varchar(255),
    date varchar (255),
)

CREATE TABLE tracker(
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    type varchar(255) NOT NULL,
    description varchar(255),
    date varchar (255)
)