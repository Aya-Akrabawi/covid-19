DROP TABLE IF EXISTS corona;

CREATE TABLE corona (
    id serial PRIMARY KEY,
    country VARCHAR(255) ,
    totalconfirmed VARCHAR(255) ,
    totaldeaths VARCHAR(255) ,
    totalrecovered VARCHAR(255) ,
    dates VARCHAR(255) 
);
