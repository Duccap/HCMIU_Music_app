IMAGE_NAME := mysql:8.0
CONTAINER_NAME := mysql-music_app
DB_NAME := music_app

mysql:
	@docker run --name $(CONTAINER_NAME) -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -d $(IMAGE_NAME)

createdb:
	@docker exec -it $(CONTAINER_NAME) mysql -uroot -psecret -e "CREATE DATABASE $(DB_NAME)"

dropdb:
	@docker exec -it $(CONTAINER_NAME) mysql -uroot -psecret -e "DROP DATABASE $(DB_NAME)"


migratedown:

.PHONY: postgres createdb dropdb migrateup migratedown