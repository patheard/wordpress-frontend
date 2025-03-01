FROM oven/bun:1.2.4-slim AS install

RUN mkdir -p /tmp/build
WORKDIR /tmp/build

COPY . .
RUN bun install --frozen-lockfile --production
RUN bun build --entrypoints ./index.ts --outdir ./dist --target=bun

FROM oven/bun:1.2.4-distroless AS release
WORKDIR /var/task

COPY --from=install /tmp/build/dist index.js
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY ./public ./public

ENV PORT=5000
ENTRYPOINT [ "bun", "--bun", "run", "index.js" ]