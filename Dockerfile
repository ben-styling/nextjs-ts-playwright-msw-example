# Installs dependancies
FROM public.ecr.aws/docker/library/node:16.19.0-alpine3.16 AS install
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .

# Image to run tests
FROM public.ecr.aws/docker/library/node:16.19.0-alpine3.16
FROM mcr.microsoft.com/playwright:v1.35.1-jammy AS test
ENV CI 1
ENV NODE_ENV test
ENV NEXT_PUBLIC_API_MOCKING msw
WORKDIR /app
COPY --from=install /app .
CMD [ "npm", "test" ]
