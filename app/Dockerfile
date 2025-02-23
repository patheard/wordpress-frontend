FROM oven/bun:1.2.2-slim AS install

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM oven/bun:1.2.2-distroless AS release
WORKDIR /var/task

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter
COPY . .

ENV PORT=5000
ENTRYPOINT [ "bun", "run", "index.ts" ]