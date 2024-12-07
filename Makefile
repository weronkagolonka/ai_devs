.PHONY: up down

guard-%:
	@ if [ "${${*}}" = "" ]; then \
    	echo "Environment variable $* not set"; \
    	exit 1; \
	fi


up: guard-NEO4J_LOCAL_PASSWORD
	docker compose up -d

down:
	docker compose down && rm -rf ./.volumes