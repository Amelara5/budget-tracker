CREATE TABLE budget(
    id SERIAL PRIMARY KEY,
    amount INTEGER NOT NULL,
    type varchar(255) NOT NULL,
    description varchar(255),
    date varchar (255),
)