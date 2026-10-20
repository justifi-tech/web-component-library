FROM node:24.3.0

# Build-time env vars required by Stencil's replace plugin
ARG IFRAME_ORIGIN
ARG PROXY_API_ORIGIN
ARG API_ORIGIN
ENV IFRAME_ORIGIN=$IFRAME_ORIGIN
ENV PROXY_API_ORIGIN=$PROXY_API_ORIGIN
ENV API_ORIGIN=$API_ORIGIN

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

# Set working directory
WORKDIR /app

# Manifests first, so the dependency layer stays cached across source-only changes
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/component-examples/package.json apps/component-examples/
COPY packages/webcomponents/package.json packages/webcomponents/
COPY packages/types/package.json packages/types/
COPY docs/package.json docs/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the code
COPY . .

# Build webcomponents package
RUN pnpm --filter @justifi/webcomponents build

# Expose port
EXPOSE 3000

# Start unified component server
CMD ["pnpm", "--filter", "@repo/component-examples", "start:server"]
