CREATE TABLE games (
    g_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    game_status VARCHAR(20) DEFAULT 'Jugando' CHECK (game_status IN ('Jugando', 'Completado', 'Abandonado')),
    homepage_url TEXT
);

CREATE TABLE time_log (
    tl_id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(g_id) ON DELETE CASCADE,
    hours_played DECIMAL(5,2) NOT NULL,
    registration_date DATE NOT NULL,
    notes TEXT
);