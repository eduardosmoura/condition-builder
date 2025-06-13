import { Filter, Operator } from '../../types';
import { CriteriaList } from './CriteriaList';

describe('CriteriaList', () => {
  let criteriaList: CriteriaList;
  let mockFilter1: Filter;
  let mockFilter2: Filter;
  let mockFilter3: Filter;

  beforeEach(() => {
    criteriaList = new CriteriaList();

    mockFilter1 = {
      id: 'filter-1',
      leftCondition: 'name',
      operator: Operator.EQ,
      value: 'John'
    };

    mockFilter2 = {
      id: 'filter-2',
      leftCondition: 'age',
      operator: Operator.GT,
      value: '25'
    };

    mockFilter3 = {
      id: 'filter-3',
      leftCondition: 'email',
      operator: Operator.C,
      value: '@gmail.com'
    };
  });

  describe('constructor', () => {
    it('should initialize with empty filters array', () => {
      expect(criteriaList.all()).toEqual([]);
      expect(criteriaList.size()).toBe(0);
    });

    it('should be an instance of CriteriaList', () => {
      expect(criteriaList).toBeInstanceOf(CriteriaList);
    });
  });

  describe('all()', () => {
    it('should return empty array when no filters are added', () => {
      expect(criteriaList.all()).toEqual([]);
    });

    it('should return all filters when filters are added', () => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);

      const filters = criteriaList.all();
      expect(filters).toHaveLength(3);
      expect(filters[0]).toEqual(mockFilter1);
      expect(filters[1]).toEqual(mockFilter2);
      expect(filters[2]).toEqual(mockFilter3);
    });

    it('should return a copy of the filters array, not the original', () => {
      criteriaList.add(mockFilter1);
      const filters = criteriaList.all();

      filters.push(mockFilter2);

      expect(criteriaList.all()).toHaveLength(2);
      expect(criteriaList.size()).toBe(2);
    });
  });

  describe('size()', () => {
    it('should return 0 for empty criteria list', () => {
      expect(criteriaList.size()).toBe(0);
    });

    it('should return correct size after adding filters', () => {
      criteriaList.add(mockFilter1);
      expect(criteriaList.size()).toBe(1);

      criteriaList.add(mockFilter2);
      expect(criteriaList.size()).toBe(2);

      criteriaList.add(mockFilter3);
      expect(criteriaList.size()).toBe(3);
    });

    it('should return correct size after removing filters', () => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);

      criteriaList.remove(1);
      expect(criteriaList.size()).toBe(2);

      criteriaList.remove(0);
      expect(criteriaList.size()).toBe(1);
    });
  });

  describe('clear()', () => {
    it('should clear empty criteria list', () => {
      criteriaList.clear();
      expect(criteriaList.all()).toEqual([]);
      expect(criteriaList.size()).toBe(0);
    });

    it('should clear criteria list with filters', () => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);

      criteriaList.clear();
      expect(criteriaList.all()).toEqual([]);
      expect(criteriaList.size()).toBe(0);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);
    });

    it('should return correct filter at valid index', () => {
      expect(criteriaList.get(0)).toEqual(mockFilter1);
      expect(criteriaList.get(1)).toEqual(mockFilter2);
      expect(criteriaList.get(2)).toEqual(mockFilter3);
    });

    it('should return undefined for invalid index', () => {
      expect(criteriaList.get(-1)).toBeUndefined();
      expect(criteriaList.get(3)).toBeUndefined();
      expect(criteriaList.get(100)).toBeUndefined();
    });

    it('should return filter with correct properties', () => {
      const filter = criteriaList.get(0);
      expect(filter).toHaveProperty('id');
      expect(filter).toHaveProperty('leftCondition');
      expect(filter).toHaveProperty('operator');
      expect(filter).toHaveProperty('value');
    });
  });

  describe('set()', () => {
    beforeEach(() => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);
    });

    it('should set filter at valid index', () => {
      const updatedFilter: Filter = {
        id: 'updated-filter',
        leftCondition: 'status',
        operator: Operator.EQ,
        value: 'active'
      };

      criteriaList.set(1, updatedFilter);
      expect(criteriaList.get(1)).toEqual(updatedFilter);

      const allFilters = criteriaList.all();
      expect(allFilters[0]).toEqual(mockFilter1);
      expect(allFilters[1]).toEqual(updatedFilter);
      expect(allFilters[2]).toEqual(mockFilter3);
    });

    it('should set filter at index 0', () => {
      const newFirstFilter: Filter = {
        id: 'new-first',
        leftCondition: 'category',
        operator: Operator.NC,
        value: 'archived'
      };

      criteriaList.set(0, newFirstFilter);
      expect(criteriaList.get(0)).toEqual(newFirstFilter);
    });

    it('should set filter at last index', () => {
      const newLastFilter: Filter = {
        id: 'new-last',
        leftCondition: 'date',
        operator: Operator.LT,
        value: '2023-01-01'
      };

      criteriaList.set(2, newLastFilter);
      expect(criteriaList.get(2)).toEqual(newLastFilter);
    });

    it('should not change size when setting at valid index', () => {
      const originalSize = criteriaList.size();
      const updatedFilter: Filter = {
        id: 'updated',
        leftCondition: 'test',
        operator: Operator.RGX,
        value: '^test.*'
      };

      criteriaList.set(1, updatedFilter);
      expect(criteriaList.size()).toBe(originalSize);
    });
  });

  describe('add()', () => {
    it('should add filter to empty criteria list', () => {
      criteriaList.add(mockFilter1);
      expect(criteriaList.all()).toEqual([mockFilter1]);
      expect(criteriaList.size()).toBe(1);
    });

    it('should add multiple filters in order', () => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);

      const filters = criteriaList.all();
      expect(filters).toEqual([mockFilter1, mockFilter2, mockFilter3]);
      expect(criteriaList.size()).toBe(3);
    });

    it('should add filters with different operators', () => {
      const filters: Filter[] = [
        {
          id: '1',
          leftCondition: 'name',
          operator: Operator.EQ,
          value: 'John'
        },
        { id: '2', leftCondition: 'age', operator: Operator.GT, value: '25' },
        {
          id: '3',
          leftCondition: 'email',
          operator: Operator.C,
          value: '@gmail.com'
        },
        {
          id: '4',
          leftCondition: 'status',
          operator: Operator.NC,
          value: 'inactive'
        },
        {
          id: '5',
          leftCondition: 'score',
          operator: Operator.LT,
          value: '100'
        },
        {
          id: '6',
          leftCondition: 'code',
          operator: Operator.RGX,
          value: '^[A-Z]{3}'
        }
      ];

      filters.forEach((filter) => criteriaList.add(filter));

      expect(criteriaList.size()).toBe(6);
      expect(criteriaList.all()).toEqual(filters);
    });

    it('should add filters with same properties but different IDs', () => {
      const filter1: Filter = {
        id: 'filter-1',
        leftCondition: 'name',
        operator: Operator.EQ,
        value: 'John'
      };

      const filter2: Filter = {
        id: 'filter-2',
        leftCondition: 'name',
        operator: Operator.EQ,
        value: 'John'
      };

      criteriaList.add(filter1);
      criteriaList.add(filter2);

      expect(criteriaList.all()).toEqual([filter1, filter2]);
      expect(criteriaList.size()).toBe(2);
    });
  });

  describe('insert()', () => {
    beforeEach(() => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);
    });

    it('should insert filter after specified index', () => {
      const insertedFilter: Filter = {
        id: 'inserted',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'IT'
      };

      criteriaList.insert(1, insertedFilter);

      const filters = criteriaList.all();
      expect(filters).toEqual([
        mockFilter1,
        mockFilter2,
        insertedFilter,
        mockFilter3
      ]);
      expect(criteriaList.size()).toBe(4);
    });

    it('should insert filter after index 0', () => {
      const afterFirstFilter: Filter = {
        id: 'after-first',
        leftCondition: 'priority',
        operator: Operator.GT,
        value: '5'
      };

      criteriaList.insert(0, afterFirstFilter);

      const filters = criteriaList.all();
      expect(filters).toEqual([
        mockFilter1,
        afterFirstFilter,
        mockFilter2,
        mockFilter3
      ]);
      expect(criteriaList.size()).toBe(4);
    });

    it('should insert filter after last index', () => {
      const afterLastFilter: Filter = {
        id: 'after-last',
        leftCondition: 'created',
        operator: Operator.LT,
        value: '2023-12-31'
      };

      criteriaList.insert(2, afterLastFilter);

      const filters = criteriaList.all();
      expect(filters).toEqual([
        mockFilter1,
        mockFilter2,
        mockFilter3,
        afterLastFilter
      ]);
      expect(criteriaList.size()).toBe(4);
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      criteriaList.add(mockFilter1);
      criteriaList.add(mockFilter2);
      criteriaList.add(mockFilter3);
    });

    it('should remove filter at specified index', () => {
      criteriaList.remove(1);

      const filters = criteriaList.all();
      expect(filters).toEqual([mockFilter1, mockFilter3]);
      expect(criteriaList.size()).toBe(2);
    });

    it('should remove filter at index 0', () => {
      criteriaList.remove(0);

      const filters = criteriaList.all();
      expect(filters).toEqual([mockFilter2, mockFilter3]);
      expect(criteriaList.size()).toBe(2);
    });

    it('should remove filter at last index', () => {
      criteriaList.remove(2);

      const filters = criteriaList.all();
      expect(filters).toEqual([mockFilter1, mockFilter2]);
      expect(criteriaList.size()).toBe(2);
    });

    it('should handle removing from single filter list', () => {
      criteriaList.clear();
      criteriaList.add(mockFilter1);

      criteriaList.remove(0);

      expect(criteriaList.all()).toEqual([]);
      expect(criteriaList.size()).toBe(0);
    });
  });

  describe('Filter-specific operations', () => {
    it('should handle filters with all operator types', () => {
      const filters: Filter[] = [
        {
          id: '1',
          leftCondition: 'name',
          operator: Operator.EQ,
          value: 'John'
        },
        { id: '2', leftCondition: 'age', operator: Operator.GT, value: '25' },
        {
          id: '3',
          leftCondition: 'score',
          operator: Operator.LT,
          value: '100'
        },
        {
          id: '4',
          leftCondition: 'description',
          operator: Operator.C,
          value: 'test'
        },
        {
          id: '5',
          leftCondition: 'tags',
          operator: Operator.NC,
          value: 'archived'
        },
        {
          id: '6',
          leftCondition: 'code',
          operator: Operator.RGX,
          value: '^[A-Z]{3}'
        }
      ];

      filters.forEach((filter) => criteriaList.add(filter));

      expect(criteriaList.size()).toBe(6);

      filters.forEach((filter, index) => {
        const storedFilter = criteriaList.get(index);
        expect(storedFilter).toEqual(filter);
        expect(storedFilter.operator).toBe(filter.operator);
      });
    });

    it('should handle filters with empty values', () => {
      const filterWithEmptyValue: Filter = {
        id: 'empty-value',
        leftCondition: 'optional',
        operator: Operator.EQ,
        value: ''
      };

      criteriaList.add(filterWithEmptyValue);

      expect(criteriaList.get(0)).toEqual(filterWithEmptyValue);
      expect(criteriaList.get(0).value).toBe('');
    });

    it('should handle filters with special characters in values', () => {
      const specialCharFilter: Filter = {
        id: 'special-chars',
        leftCondition: 'regex',
        operator: Operator.RGX,
        value: '^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      };

      criteriaList.add(specialCharFilter);

      expect(criteriaList.get(0)).toEqual(specialCharFilter);
    });
  });
});
