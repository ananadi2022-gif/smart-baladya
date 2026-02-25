// Helper to satisfy editors/TS server when using Vite/tsconfig path aliases.
// This provides a broad module declaration for imports that start with "@/" or "@shared/".
declare module "@/*";
declare module "@shared/*";
