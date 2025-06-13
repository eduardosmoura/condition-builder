import { Criteria } from 'core';

describe('Criteria', () => {
  let criteria: Criteria<string>;

  beforeEach(() => {
    criteria = new Criteria<string>();
  });

  describe('constructor', () => {
    it('should initialize with empty terms array', () => {
      expect(criteria.all()).toEqual([]);
      expect(criteria.size()).toBe(0);
    });
  });

  describe('all()', () => {
    it('should return empty array when no terms are added', () => {
      expect(criteria.all()).toEqual([]);
    });

    it('should return all terms when terms are added', () => {
      criteria.add('term1');
      criteria.add('term2');
      criteria.add('term3');

      expect(criteria.all()).toEqual(['term1', 'term2', 'term3']);
    });

    it('should return a copy of the terms array, not the original', () => {
      criteria.add('term1');
      const terms = criteria.all();
      terms.push('term2');

      expect(criteria.all()).toEqual(['term1', 'term2']);
      expect(criteria.size()).toBe(2);
    });
  });

  describe('size()', () => {
    it('should return 0 for empty criteria', () => {
      expect(criteria.size()).toBe(0);
    });

    it('should return correct size after adding terms', () => {
      criteria.add('term1');
      expect(criteria.size()).toBe(1);

      criteria.add('term2');
      expect(criteria.size()).toBe(2);

      criteria.add('term3');
      expect(criteria.size()).toBe(3);
    });

    it('should return correct size after removing terms', () => {
      criteria.add('term1');
      criteria.add('term2');
      criteria.add('term3');

      criteria.remove(1);
      expect(criteria.size()).toBe(2);

      criteria.remove(0);
      expect(criteria.size()).toBe(1);
    });
  });

  describe('clear()', () => {
    it('should clear empty criteria', () => {
      criteria.clear();
      expect(criteria.all()).toEqual([]);
      expect(criteria.size()).toBe(0);
    });

    it('should clear criteria with terms', () => {
      criteria.add('term1');
      criteria.add('term2');
      criteria.add('term3');

      criteria.clear();
      expect(criteria.all()).toEqual([]);
      expect(criteria.size()).toBe(0);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      criteria.add('first');
      criteria.add('second');
      criteria.add('third');
    });

    it('should return correct term at valid index', () => {
      expect(criteria.get(0)).toBe('first');
      expect(criteria.get(1)).toBe('second');
      expect(criteria.get(2)).toBe('third');
    });

    it('should return undefined for invalid index', () => {
      expect(criteria.get(-1)).toBeUndefined();
      expect(criteria.get(3)).toBeUndefined();
      expect(criteria.get(100)).toBeUndefined();
    });
  });

  describe('set()', () => {
    beforeEach(() => {
      criteria.add('first');
      criteria.add('second');
      criteria.add('third');
    });

    it('should set term at valid index', () => {
      criteria.set(1, 'updated');
      expect(criteria.get(1)).toBe('updated');
      expect(criteria.all()).toEqual(['first', 'updated', 'third']);
    });

    it('should set term at index 0', () => {
      criteria.set(0, 'new-first');
      expect(criteria.get(0)).toBe('new-first');
      expect(criteria.all()).toEqual(['new-first', 'second', 'third']);
    });

    it('should set term at last index', () => {
      criteria.set(2, 'new-third');
      expect(criteria.get(2)).toBe('new-third');
      expect(criteria.all()).toEqual(['first', 'second', 'new-third']);
    });

    it('should not change size when setting at valid index', () => {
      const originalSize = criteria.size();
      criteria.set(1, 'updated');
      expect(criteria.size()).toBe(originalSize);
    });
  });

  describe('add()', () => {
    it('should add term to empty criteria', () => {
      criteria.add('first');
      expect(criteria.all()).toEqual(['first']);
      expect(criteria.size()).toBe(1);
    });

    it('should add multiple terms in order', () => {
      criteria.add('first');
      criteria.add('second');
      criteria.add('third');

      expect(criteria.all()).toEqual(['first', 'second', 'third']);
      expect(criteria.size()).toBe(3);
    });

    it('should add duplicate terms', () => {
      criteria.add('term');
      criteria.add('term');
      criteria.add('term');

      expect(criteria.all()).toEqual(['term', 'term', 'term']);
      expect(criteria.size()).toBe(3);
    });
  });

  describe('insert()', () => {
    beforeEach(() => {
      criteria.add('first');
      criteria.add('second');
      criteria.add('third');
    });

    it('should insert term after specified index', () => {
      criteria.insert(1, 'inserted');
      expect(criteria.all()).toEqual(['first', 'second', 'inserted', 'third']);
      expect(criteria.size()).toBe(4);
    });

    it('should insert term after index 0', () => {
      criteria.insert(0, 'after-first');
      expect(criteria.all()).toEqual([
        'first',
        'after-first',
        'second',
        'third'
      ]);
      expect(criteria.size()).toBe(4);
    });

    it('should insert term after last index', () => {
      criteria.insert(2, 'after-third');
      expect(criteria.all()).toEqual([
        'first',
        'second',
        'third',
        'after-third'
      ]);
      expect(criteria.size()).toBe(4);
    });

    it('should insert term in empty criteria at index 0', () => {
      const emptyCriteria = new Criteria<string>();
      emptyCriteria.insert(0, 'first');
      expect(emptyCriteria.all()).toEqual(['first']);
      expect(emptyCriteria.size()).toBe(1);
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      criteria.add('first');
      criteria.add('second');
      criteria.add('third');
      criteria.add('fourth');
    });

    it('should remove term at specified index', () => {
      criteria.remove(1);
      expect(criteria.all()).toEqual(['first', 'third', 'fourth']);
      expect(criteria.size()).toBe(3);
    });

    it('should remove first term', () => {
      criteria.remove(0);
      expect(criteria.all()).toEqual(['second', 'third', 'fourth']);
      expect(criteria.size()).toBe(3);
    });

    it('should remove last term', () => {
      criteria.remove(3);
      expect(criteria.all()).toEqual(['first', 'second', 'third']);
      expect(criteria.size()).toBe(3);
    });

    it('should handle removing from single item criteria', () => {
      const singleCriteria = new Criteria<string>();
      singleCriteria.add('only');
      singleCriteria.remove(0);

      expect(singleCriteria.all()).toEqual([]);
      expect(singleCriteria.size()).toBe(0);
    });
  });

  describe('generic type support', () => {
    it('should work with number type', () => {
      const numberCriteria = new Criteria<number>();
      numberCriteria.add(1);
      numberCriteria.add(2);
      numberCriteria.add(3);

      expect(numberCriteria.all()).toEqual([1, 2, 3]);
      expect(numberCriteria.get(1)).toBe(2);
    });

    it('should work with object type', () => {
      interface TestObject {
        id: number;
        name: string;
      }

      const objectCriteria = new Criteria<TestObject>();
      const obj1 = { id: 1, name: 'test1' };
      const obj2 = { id: 2, name: 'test2' };

      objectCriteria.add(obj1);
      objectCriteria.add(obj2);

      expect(objectCriteria.all()).toEqual([obj1, obj2]);
      expect(objectCriteria.get(0)).toBe(obj1);
    });
  });
});
