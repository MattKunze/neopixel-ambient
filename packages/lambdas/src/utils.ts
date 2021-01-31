export const createResponse = (body: string | Record<string, unknown>) => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: typeof body === "string" ? body : JSON.stringify(body),
})
