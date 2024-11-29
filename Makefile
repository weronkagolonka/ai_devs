up:
	docker compose up -d

down:
	docker compose down && rm -rf ./qdrant_data