FROM oven/bun:1.1-alpine

WORKDIR /builder

COPY bun.lockb .
COPY package.json .
COPY tsconfig.json .

RUN bun install --frozen-lockfile

RUN mkdir /app

COPY src ./src
RUN bun build ./src/index.ts --compile --outfile /app/mdnotes

CMD ["/app/mdnotes"]
