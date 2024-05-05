postgres:
	@docker run --name postgres-music_app -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine

createdb:
	@docker exec -it postgres-music_app createdb --username=root --owner=root music_app

dropdb:
	@docker exec -it postgres-music_app dropdb music_app

migrateup:

migratedown:

.PHONY: postgres createdb dropdb migrateup migratedown