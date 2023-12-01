build:
	docker build -t server . && docker run -dp 3000:3000 server
