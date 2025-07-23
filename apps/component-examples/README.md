# Enhanced Component Examples

This directory contains enhanced component examples with a modern three-panel layout featuring live props editing and real-time event logging.

## 🚀 Quick Start

### Prerequisites

1. Make sure you have the required environment variables set in your `.env` file:

   ```bash
   API_ORIGIN=https://api.justifi.com
   CLIENT_ID=your_client_id
   CLIENT_SECRET=your_client_secret
   SUB_ACCOUNT_ID=your_sub_account_id
   PAYMENT_METHOD_GROUP_ID=your_payment_method_group_id
   PORT=3000
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Enhanced Examples

To run the enhanced checkout example with the new JSX template system:

```bash
pnpm dev:enhanced
```

This will start the server at `http://localhost:3000` with the following features:

- **Landing Page**: `http://localhost:3000/` - Overview of available examples
- **Checkout Example**: `http://localhost:3000/checkout` - Enhanced checkout with three-panel layout

## 🎨 Features

### Three-Panel Layout

- **Component Preview**: Live display of the web component
- **Props Editor**: Real-time editing of component properties
- **Event Logger**: Comprehensive event tracking and display

### Live Props Editing

- Dynamic form generation based on component props
- Real-time updates as you change values
- Support for different input types (string, number, boolean, select, object)
- Copy to clipboard functionality

### Event Logging

- Real-time event capture from web components
- Color-coded event levels (info, warning, error, success)
- Event filtering by type
- Export functionality for debugging

### Navigation

- Categorized example navigation
- Responsive design
- Easy switching between examples

## 🛠️ Development

### Project Structure

```
src/
├── components/           # JSX template components
│   ├── ExampleLayout.tsx
│   ├── ComponentPreview.tsx
│   ├── PropsEditor.tsx
│   ├── EventLogger.tsx
│   └── NavigationMenu.tsx
├── templates/           # JSX templates
│   ├── base-template.tsx
│   └── example-template.tsx
├── server/             # Server infrastructure
│   ├── express-server.ts
│   ├── auth-service.ts
│   └── jsx-renderer.ts
├── examples/           # Example implementations
│   └── checkout-example.ts
└── utils/              # Utilities
    └── simple-jsx.ts   # Custom JSX renderer
```

### Adding New Examples

1. Create a new example file in `src/examples/`
2. Use the `ExampleTemplate` and configure props, events, and navigation
3. Add a route in `src/server/enhanced-server.ts`
4. Update the landing page with the new example

### Available Scripts

- `pnpm dev:enhanced` - Run the enhanced examples server
- `pnpm build` - Build TypeScript files
- `pnpm build:watch` - Watch mode for TypeScript compilation

## 🔧 Technical Details

### JSX Templates (No React)

- Custom JSX renderer using `simple-jsx.ts`
- TypeScript support with proper type safety
- Server-side rendering for optimal performance

### Architecture

- Express.js server with TypeScript
- Modular component system
- Event-driven architecture
- Responsive CSS Grid layout

### Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and tablet
- Progressive enhancement approach

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables**: Make sure all required environment variables are set
2. **Port Conflicts**: Change the PORT in your .env file if 3000 is in use
3. **API Errors**: Check your API credentials and network connectivity
4. **TypeScript Errors**: Run `pnpm build` to check for compilation errors

### Debug Mode

To run with additional logging:

```bash
DEBUG=* pnpm dev:enhanced
```

## 📝 Next Steps

This enhanced system is part of a larger plan to modernize all component examples. Future phases will include:

- More examples with the enhanced template system
- Advanced props management
- State persistence and sharing
- Code examples panel
- Enhanced documentation

For more details, see the `PLAN.md` file.
