CREATE TABLE `Users` (
  `id` int PRIMARY KEY,
  `username` varchar(255) UNIQUE,
  `password` varchar(255),
  `email` varchar(255) UNIQUE,
  `avatar_location` varchar(255) UNIQUE
);

CREATE TABLE `Songs` (
  `id` int PRIMARY KEY,
  `title` varchar(255),
  `artist` varchar(255),
  `album` varchar(255),
  `duration` int,
  `file_location` varchar(255)
);

CREATE TABLE `Playlists` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `user_id` int
);

CREATE TABLE `Playlist_Songs` (
  `playlist_id` int,
  `song_id` int,
  PRIMARY KEY (`playlist_id`, `song_id`)
);

CREATE INDEX `Songs_index_0` ON `Songs` (`title`);

ALTER TABLE `Playlists` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Playlist_Songs` ADD FOREIGN KEY (`playlist_id`) REFERENCES `Playlists` (`id`);

ALTER TABLE `Playlist_Songs` ADD FOREIGN KEY (`song_id`) REFERENCES `Songs` (`id`);
