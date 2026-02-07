FROM node:24.3.0

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

# Set working directory
WORKDIR /app

# Copy entire monorepo
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build webcomponents package
RUN pnpm --filter @justifi/webcomponents build

# Expose port
EXPOSE 3000

# Start checkout component server
CMD ["pnpm", "--filter", "@repo/component-examples", "start:checkout"]
