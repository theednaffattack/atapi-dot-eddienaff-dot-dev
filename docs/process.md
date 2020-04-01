# Process

## Build and push to Docker Registry

build: `docker build -t theednaffattack/atapi-dot-eddienaff-dot-dev:prod .`

push: `docker push theednaffattack/atapi-dot-eddienaff-dot-dev:prod`

combined: `docker build -t theednaffattack/atapi-dot-eddienaff-dot-dev:prod . && docker push theednaffattack/atapi-dot-eddienaff-dot-dev:prod`
