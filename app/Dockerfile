FROM public.ecr.aws/docker/library/node:22-slim

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter

ENV PORT=5000
ENV NODE_ENV=production

WORKDIR /var/task
COPY . .
RUN npm ci

CMD ["node", "index.js"]