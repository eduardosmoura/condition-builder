import { CriteriaGroup, CriteriaList } from 'core';
import { Filter, Operator } from 'types';

describe('CriteriaGroup', () => {
  let criteriaGroup: CriteriaGroup;
  let mockCriteriaList: CriteriaList;
  let mockFilter: Filter;

  beforeEach(() => {
    criteriaGroup = new CriteriaGroup();
    mockCriteriaList = new CriteriaList();
    mockFilter = {
      id: '1',
      leftCondition: 'name',
      operator: Operator.EQ,
      value: 'test'
    };
    mockCriteriaList.add(mockFilter);
  });

  describe('constructor', () => {
    it('should create an instance of CriteriaGroup', () => {
      expect(criteriaGroup).toBeInstanceOf(CriteriaGroup);
    });

    it('should initialize with empty terms array', () => {
      expect(criteriaGroup.size()).toBe(0);
      expect(criteriaGroup.all()).toEqual([]);
    });
  });

  describe('all()', () => {
    it('should return all CriteriaList items', () => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();

      criteriaGroup.add(criteriaList1);
      criteriaGroup.add(criteriaList2);

      const result = criteriaGroup.all();
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(criteriaList1);
      expect(result[1]).toBe(criteriaList2);
    });

    it('should return empty array when no items added', () => {
      expect(criteriaGroup.all()).toEqual([]);
    });
  });

  describe('size()', () => {
    it('should return 0 for empty criteria group', () => {
      expect(criteriaGroup.size()).toBe(0);
    });

    it('should return correct size after adding items', () => {
      criteriaGroup.add(mockCriteriaList);
      expect(criteriaGroup.size()).toBe(1);

      criteriaGroup.add(new CriteriaList());
      expect(criteriaGroup.size()).toBe(2);
    });

    it('should return correct size after removing items', () => {
      criteriaGroup.add(mockCriteriaList);
      criteriaGroup.add(new CriteriaList());
      expect(criteriaGroup.size()).toBe(2);

      criteriaGroup.remove(0);
      expect(criteriaGroup.size()).toBe(1);
    });
  });

  describe('clear()', () => {
    it('should remove all items from criteria group', () => {
      criteriaGroup.add(mockCriteriaList);
      criteriaGroup.add(new CriteriaList());
      expect(criteriaGroup.size()).toBe(2);

      criteriaGroup.clear();
      expect(criteriaGroup.size()).toBe(0);
      expect(criteriaGroup.all()).toEqual([]);
    });

    it('should not throw error when clearing empty criteria group', () => {
      expect(() => criteriaGroup.clear()).not.toThrow();
      expect(criteriaGroup.size()).toBe(0);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      criteriaGroup.add(mockCriteriaList);
    });

    it('should return correct item at given index', () => {
      const result = criteriaGroup.get(0);
      expect(result).toBe(mockCriteriaList);
    });

    it('should return undefined for invalid index', () => {
      const result = criteriaGroup.get(999);
      expect(result).toBeUndefined();
    });

    it('should return undefined for negative index', () => {
      const result = criteriaGroup.get(-1);
      expect(result).toBeUndefined();
    });
  });

  describe('set()', () => {
    beforeEach(() => {
      criteriaGroup.add(mockCriteriaList);
    });

    it('should replace item at given index', () => {
      const newCriteriaList = new CriteriaList();
      criteriaGroup.set(0, newCriteriaList);

      expect(criteriaGroup.get(0)).toBe(newCriteriaList);
      expect(criteriaGroup.size()).toBe(1);
    });

    it('should handle setting at non-existent index', () => {
      const newCriteriaList = new CriteriaList();
      criteriaGroup.set(5, newCriteriaList);

      expect(criteriaGroup.get(5)).toBe(newCriteriaList);
    });
  });

  describe('add()', () => {
    it('should add CriteriaList to the group', () => {
      expect(criteriaGroup.size()).toBe(0);

      criteriaGroup.add(mockCriteriaList);
      expect(criteriaGroup.size()).toBe(1);
      expect(criteriaGroup.get(0)).toBe(mockCriteriaList);
    });

    it('should add multiple CriteriaList items', () => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();

      criteriaGroup.add(criteriaList1);
      criteriaGroup.add(criteriaList2);

      expect(criteriaGroup.size()).toBe(2);
      expect(criteriaGroup.get(0)).toBe(criteriaList1);
      expect(criteriaGroup.get(1)).toBe(criteriaList2);
    });
  });

  describe('insert()', () => {
    beforeEach(() => {
      criteriaGroup.add(mockCriteriaList);
    });

    it('should insert CriteriaList at specified index', () => {
      const newCriteriaList = new CriteriaList();
      criteriaGroup.insert(0, newCriteriaList);

      expect(criteriaGroup.size()).toBe(2);
      expect(criteriaGroup.get(0)).toBe(mockCriteriaList);
      expect(criteriaGroup.get(1)).toBe(newCriteriaList);
    });

    it('should insert at beginning when index is 0', () => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();

      criteriaGroup.add(criteriaList1);
      criteriaGroup.insert(-1, criteriaList2);

      expect(criteriaGroup.size()).toBe(3);
      expect(criteriaGroup.get(0)).toBe(criteriaList2);
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();

      criteriaGroup.add(mockCriteriaList);
      criteriaGroup.add(criteriaList1);
      criteriaGroup.add(criteriaList2);
    });

    it('should remove item at specified index', () => {
      expect(criteriaGroup.size()).toBe(3);

      criteriaGroup.remove(1);
      expect(criteriaGroup.size()).toBe(2);
      expect(criteriaGroup.get(0)).toBe(mockCriteriaList);
    });

    it('should handle removing from empty array', () => {
      criteriaGroup.clear();
      expect(() => criteriaGroup.remove(0)).not.toThrow();
      expect(criteriaGroup.size()).toBe(0);
    });

    it('should handle invalid index gracefully', () => {
      const originalSize = criteriaGroup.size();
      criteriaGroup.remove(999);
      expect(criteriaGroup.size()).toBe(originalSize);
    });
  });

  describe('integration tests', () => {
    it('should work correctly with nested CriteriaList operations', () => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();

      const filter1: Filter = {
        id: '1',
        leftCondition: 'age',
        operator: Operator.GT,
        value: '18'
      };

      const filter2: Filter = {
        id: '2',
        leftCondition: 'status',
        operator: Operator.EQ,
        value: 'active'
      };

      criteriaList1.add(filter1);
      criteriaList2.add(filter2);

      criteriaGroup.add(criteriaList1);
      criteriaGroup.add(criteriaList2);

      expect(criteriaGroup.size()).toBe(2);
      expect(criteriaGroup.get(0).size()).toBe(1);
      expect(criteriaGroup.get(1).size()).toBe(1);
      expect(criteriaGroup.get(0).get(0)).toEqual(filter1);
      expect(criteriaGroup.get(1).get(0)).toEqual(filter2);
    });

    it('should maintain data integrity through complex operations', () => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();
      const criteriaList3 = new CriteriaList();

      criteriaGroup.add(criteriaList1);
      criteriaGroup.add(criteriaList2);
      expect(criteriaGroup.size()).toBe(2);

      criteriaGroup.insert(0, criteriaList3);
      expect(criteriaGroup.size()).toBe(3);
      expect(criteriaGroup.get(1)).toBe(criteriaList3);

      criteriaGroup.remove(1);
      expect(criteriaGroup.size()).toBe(2);
      expect(criteriaGroup.get(0)).toBe(criteriaList1);
      expect(criteriaGroup.get(1)).toBe(criteriaList2);

      criteriaGroup.clear();
      expect(criteriaGroup.size()).toBe(0);
      expect(criteriaGroup.all()).toEqual([]);
    });
  });
});
