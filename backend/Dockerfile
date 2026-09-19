FROM golang:1.23-alpine AS build
WORKDIR /src
RUN apk add --no-cache git ca-certificates
COPY backend/go.mod* backend/go.sum* ./
COPY go.mod* go.sum* ./
RUN go mod download
COPY backend/ ./
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/server ./cmd/server
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/bootstrap ./cmd/bootstrap

FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=build /out/server /app/server
COPY --from=build /out/bootstrap /app/bootstrap
COPY migrations /app/migrations
ENV TZ=Asia/Kolkata
EXPOSE 8080
USER nobody
ENTRYPOINT ["/app/server"]
