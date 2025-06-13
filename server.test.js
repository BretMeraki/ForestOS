// Basic smoke test for Forest Server
import { jest } from '@jest/globals';

// Mock fs/promises to avoid file system dependencies
const mockFs = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  readdir: jest.fn(),
  appendFile: jest.fn()
};

jest.unstable_mockModule('fs/promises', () => mockFs);

describe('Forest Server', () => {
  let ForestServer;
  
  beforeAll(async () => {
    // Import after mocking
    const module = await import('./server.js');
    ForestServer = module.default;
  });

  test('should create ForestServer instance', () => {
    const server = new ForestServer();
    expect(server).toBeDefined();
    expect(server.dataDir).toBeDefined();
    expect(server.activeProject).toBeNull();
  });

  test('should parse time correctly', () => {
    const server = new ForestServer();
    expect(server.parseTime('6:00 AM')).toBe(360); // 6 * 60
    expect(server.parseTime('12:00 PM')).toBe(720); // 12 * 60
    expect(server.parseTime('10:30 PM')).toBe(1350); // 22.5 * 60
  });

  test('should format time correctly', () => {
    const server = new ForestServer();
    expect(server.formatTime(360)).toBe('6:00 AM');
    expect(server.formatTime(720)).toBe('12:00 PM');
    expect(server.formatTime(1350)).toBe('10:30 PM');
  });

  test('should calculate knowledge boost from credentials', () => {
    const server = new ForestServer();
    const credentials = [
      {
        credential_type: "Bachelor's Degree",
        subject_area: "Marketing",
        level: "advanced",
        relevance_to_goal: "directly applicable"
      }
    ];
    const boost = server.calculateKnowledgeBoost(credentials, "Digital Marketing");
    expect(boost).toBeGreaterThan(0);
    expect(boost).toBeLessThanOrEqual(80);
  });

  test('should generate intelligent branches', () => {
    const server = new ForestServer();
    const projectConfig = {
      goal: "Learn Digital Marketing",
      urgency_level: "high"
    };
    const branches = server.generateIntelligentBranches(projectConfig, {}, []);
    expect(branches).toBeDefined();
    expect(branches.length).toBeGreaterThan(0);
    expect(branches[0]).toHaveProperty('title');
    expect(branches[0]).toHaveProperty('sequence');
  });

  test('should parse time available correctly', () => {
    const server = new ForestServer();
    expect(server.parseTimeAvailable('30 minutes')).toBe(30);
    expect(server.parseTimeAvailable('1 hour')).toBe(60);
    expect(server.parseTimeAvailable('45 min')).toBe(45);
  });
});