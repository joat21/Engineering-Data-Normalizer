import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      successMessage?: string | boolean;
      errorMessage?: string | boolean;
    };
  }
}
