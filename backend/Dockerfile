FROM golang:1.24-alpine AS build
WORKDIR /src
ENV GOTOOLCHAIN=auto
RUN apk add --no-cache git ca-certificates build-base gcc musl-dev
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o /out/server ./cmd/server
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o /out/bootstrap ./cmd/bootstrap

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=build /out/server /app/server
COPY --from=build /out/bootstrap /app/bootstrap
COPY --from=build /src/migrations /app/migrations
ENV TZ=Asia/Kolkata
EXPOSE 8080
USER nobody
ENTRYPOINT ["/app/server"]
