FROM oven/bun:1.2-alpine

WORKDIR /builder
RUN mkdir /app

RUN apk add --no-cache make curl
COPY Makefile .
COPY assets ./assets
RUN make statics

COPY bun.lock package.json tsconfig.json ./
RUN bun install --frozen-lockfile

COPY src ./src
RUN bun build ./src/index.ts --compile --outfile /app/mdnotes

CMD ["/app/mdnotes"]
