INSERT INTO "Users" (id, username, password, email, avatar_location) VALUES
(1, 'user1', 'password1', 'user1@example.com', '/avatars/avatar1.jpg'),
(2, 'user2', 'password2', 'user2@example.com', '/avatars/avatar2.jpg'),
(3, 'user3', 'password3', 'user3@example.com', '/avatars/avatar3.jpg');

INSERT INTO "Songs" (id, title, artist, album, duration, file_location) VALUES
(1, 'Song 1', 'Artist 1', 'Album 1', 180, '/songs/song1.mp3'),
(2, 'Song 2', 'Artist 2', 'Album 2', 240, '/songs/song2.mp3'),
(3, 'Song 3', 'Artist 3', 'Album 3', 200, '/songs/song3.mp3');

INSERT INTO "Playlists" (id, name, user_id) VALUES
(1, 'Playlist 1', 1),
(2, 'Playlist 2', 2),
(3, 'Playlist 3', 1);

INSERT INTO "Playlist_Songs" (playlist_id, song_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3);