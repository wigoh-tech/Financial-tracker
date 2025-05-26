import logger from '@/lib/logger';  // Adjust path to your Winston logger

describe('Winston Logger', () => {
  let infoSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on the logger methods you want to test
    infoSpy = jest.spyOn(logger, 'info').mockImplementation(jest.fn());
    errorSpy = jest.spyOn(logger, 'error').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations after each test
  });

  it('should call info method with correct message', () => {
    const message = 'This is an info log test';
    logger.info(message);
    expect(infoSpy).toHaveBeenCalledWith(message);
  });

  it('should call error method with correct message', () => {
    const message = 'This is an error log test';
    logger.error(message);
    expect(errorSpy).toHaveBeenCalledWith(message);
  });
});
