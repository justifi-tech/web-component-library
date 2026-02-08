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

# Copy the code
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build webcomponents package
RUN pnpm --filter @justifi/webcomponents build

# Expose port
EXPOSE 3000

# Start checkout component server
CMD ["pnpm", "--filter", "@repo/component-examples", "start:checkout"]
