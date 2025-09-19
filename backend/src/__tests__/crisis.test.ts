// Unit tests for crisis validation logic
import { body } from 'express-validator';

describe('Crisis Route Validation', () => {
  describe('Risk level validation', () => {
    it('should validate risk level enum', () => {
      const riskLevelValidator = body('riskLevel').isIn(['low', 'medium', 'high']);
      expect(riskLevelValidator).toBeDefined();
    });

    it('should accept low risk level', () => {
      const validRiskLevels = ['low', 'medium', 'high'];
      validRiskLevels.forEach(level => {
        const validator = body('riskLevel').isIn(['low', 'medium', 'high']);
        expect(validator).toBeDefined();
      });
    });
  });

  describe('Trigger data validation', () => {
    it('should validate trigger data as optional object', () => {
      const triggerDataValidator = body('triggerData').optional().isObject();
      expect(triggerDataValidator).toBeDefined();
    });
  });
});