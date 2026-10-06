describe('DisputeService', () => {
   
  let service: any;
  let mockGet: jest.Mock;
  let mockPost: jest.Mock;
  let mockPut: jest.Mock;
  let mockPatch: jest.Mock;

  beforeAll(() => {
    jest.resetModules();

    mockGet = jest.fn();
    mockPost = jest.fn();
    mockPut = jest.fn();
    mockPatch = jest.fn();

    jest.doMock('..', () => ({
      Api: () => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
        patch: mockPatch,
        destroy: jest.fn(),
      }),
    }));

    const { DisputeService } = require('./dispute.service');
    service = new DisputeService();
  });

  afterAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchDispute', () => {
    it('calls GET disputes/{id} with the correct authToken', async () => {
      const mockResponse = { data: { id: 'dp_abc' } };
      mockGet.mockResolvedValue(mockResponse);

      const result = await service.fetchDispute('dp_abc', 'token_123');

      expect(mockGet).toHaveBeenCalledWith({
        endpoint: 'disputes/dp_abc',
        authToken: 'token_123',
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('updateDisputeResponse', () => {
    it('calls PATCH disputes/{id}/response with payload and authToken', async () => {
      const payload = { product_description: 'Widget' };
      const mockResponse = { data: { id: 'dp_abc' } };
      mockPatch.mockResolvedValue(mockResponse);

      const result = await service.updateDisputeResponse('dp_abc', 'token_123', payload);

      expect(mockPatch).toHaveBeenCalledWith({
        endpoint: 'disputes/dp_abc/response',
        body: payload,
        authToken: 'token_123',
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('submitDisputeResponse', () => {
    it('calls POST disputes/{id}/response with payload and authToken', async () => {
      const payload = { forfeit: false, product_description: 'Widget' };
      const mockResponse = { data: { id: 'dp_abc' } };
      mockPost.mockResolvedValue(mockResponse);

      const result = await service.submitDisputeResponse('dp_abc', 'token_123', payload);

      expect(mockPost).toHaveBeenCalledWith({
        endpoint: 'disputes/dp_abc/response',
        body: payload,
        authToken: 'token_123',
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('createDisputeEvidence', () => {
    it('calls PUT disputes/{id}/evidence with payload and authToken', async () => {
      const payload = { file_name: 'receipt.pdf', file_type: 'application/pdf', dispute_evidence_type: 'receipt' };
      const mockResponse = { data: { presigned_url: 'https://s3.example.com/upload' } };
      mockPut.mockResolvedValue(mockResponse);

      const result = await service.createDisputeEvidence('dp_abc', 'token_123', payload);

      expect(mockPut).toHaveBeenCalledWith({
        endpoint: 'disputes/dp_abc/evidence',
        body: payload,
        authToken: 'token_123',
      });
      expect(result).toBe(mockResponse);
    });

    it('returns response including presigned_url', async () => {
      const mockResponse = { data: { presigned_url: 'https://s3.example.com/upload' } };
      mockPut.mockResolvedValue(mockResponse);

      const result = await service.createDisputeEvidence('dp_abc', 'token_123', {});

      expect(result.data.presigned_url).toBe('https://s3.example.com/upload');
    });
  });
});
