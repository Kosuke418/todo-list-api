export const mockJwtService = () => ({
  sign: jest.fn(() => 'mocked-jwt-token'),
  verify: jest.fn(() => ({ username: 'mocked-user' })),
});
