FROM oven/bun:1.2.2-slim AS install

RUN mkdir -p /tmp/build
WORKDIR /tmp/build

COPY . .
RUN bun install --frozen-lockfile --production
RUN bun --env-file=.env build --bytecode --compile --minify --sourcemap ./index.ts --outfile myapp
RUN chmod +x myapp

FROM oven/bun:1.2.2-distroless AS release
WORKDIR /var/task

COPY --from=install /tmp/build/myapp ./myapp
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY ./public ./public

ENV PORT=8500
EXPOSE 8500
ENTRYPOINT [ "./myapp"]