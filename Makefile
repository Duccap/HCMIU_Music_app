IMAGE_NAME := postgres:12-alpine
CONTAINER_NAME := postgres-music_app
DB_NAME := music_app

postgres:
	@docker run --name $(CONTAINER_NAME) -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d $(IMAGE_NAME)

createdb:
	@docker exec -it postgres-music_app createdb --username=root --owner=root $(DB_NAME)


dropdb:
	@docker exec -it postgres-music_app dropdb $(DB_NAME)





migratedown:

.PHONY: postgres createdb dropdb migrateup migratedown