-- Create table
CREATE TABLE dt_user (
    user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    pfp VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    PRIMARY KEY (userid)
);

CREATE TABLE music (
    music_id VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    album VARCHAR(255),
    artist VARCHAR(255),
    cover VARCHAR(255),
    deezer VARCHAR(255),
    itunes VARCHAR(255),
    preview VARCHAR(255),
    shazam VARCHAR(255),
    spotify VARCHAR(255),
    youtube VARCHAR(255),
    PRIMARY KEY(music_id)
);

CREATE TABLE detected (
    user_id VARCHAR(255) NOT NULL,
    music_id VARCHAR(255) NOT NULL,
    detected_date DATE,
    FOREIGN KEY (user_id) REFERENCES dt_user(user_id),
    FOREIGN KEY (music_id) REFERENCES music(music_id)
);