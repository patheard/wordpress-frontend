FROM oven/bun:1.2.4-slim AS install

RUN mkdir -p /tmp/build
WORKDIR /tmp/build

COPY . .
RUN bun install --frozen-lockfile --production
RUN bun --env-file=.env build --compile --minify --sourcemap ./index.ts --outfile myapp
RUN chmod +x myapp

FROM gcr.io/distroless/base-debian12 AS release
WORKDIR /var/task

COPY --from=install /tmp/build/myapp ./myapp
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY ./public ./public

ENV PORT=8500
EXPOSE 8500
ENTRYPOINT [ "./myapp"]