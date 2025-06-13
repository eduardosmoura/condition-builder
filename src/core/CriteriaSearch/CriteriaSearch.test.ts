import { Filter, Operator } from '../../types';
import { CriteriaGroup } from '../CriteriaGroup/CriteriaGroup';
import { CriteriaList } from '../CriteriaList/CriteriaList';
import { CriteriaSearch } from './CriteriaSearch';

interface TestUser {
  id: number;
  name: string;
  age: number;
  email: string;
  department: string;
  salary: number;
  active: boolean;
}

describe('CriteriaSearch', () => {
  let criteriaSearch: CriteriaSearch;
  let sampleData: TestUser[];
  let criteriaGroup: CriteriaGroup;
  let criteriaList: CriteriaList;

  beforeEach(() => {
    sampleData = [
      {
        id: 1,
        name: 'John Doe',
        age: 30,
        email: 'john@gmail.com',
        department: 'IT',
        salary: 50000,
        active: true
      },
      {
        id: 2,
        name: 'Jane Smith',
        age: 25,
        email: 'jane@yahoo.com',
        department: 'HR',
        salary: 45000,
        active: true
      },
      {
        id: 3,
        name: 'Bob Johnson',
        age: 35,
        email: 'bob@gmail.com',
        department: 'IT',
        salary: 60000,
        active: false
      },
      {
        id: 4,
        name: 'Alice Brown',
        age: 28,
        email: 'alice@outlook.com',
        department: 'Finance',
        salary: 55000,
        active: true
      },
      {
        id: 5,
        name: 'Charlie Wilson',
        age: 40,
        email: 'charlie@gmail.com',
        department: 'IT',
        salary: 70000,
        active: true
      },
      {
        id: 6,
        name: 'Diana Davis',
        age: 22,
        email: 'diana@hotmail.com',
        department: 'Marketing',
        salary: 40000,
        active: false
      }
    ];

    criteriaGroup = new CriteriaGroup();
    criteriaList = new CriteriaList();
    criteriaSearch = new CriteriaSearch(sampleData, criteriaGroup);
  });

  describe('constructor', () => {
    it('should initialize with provided data and criteria group', () => {
      const testData = [{ id: 1, name: 'test' }];
      const testCriteriaGroup = new CriteriaGroup();
      const search = new CriteriaSearch(testData, testCriteriaGroup);

      expect(search).toBeInstanceOf(CriteriaSearch);
    });

    it('should initialize with empty data', () => {
      const search = new CriteriaSearch([], new CriteriaGroup());
      const results = search.search();

      expect(results).toEqual([]);
    });
  });

  describe('search() - Empty criteria', () => {
    it('should return all data when criteria group is empty', () => {
      const results = criteriaSearch.search() as TestUser[];
      expect(results).toEqual(sampleData);
    });

    it('should return empty array when data is empty and criteria is empty', () => {
      const search = new CriteriaSearch([], criteriaGroup);
      const results = search.search();

      expect(results).toEqual([]);
    });
  });

  describe('search() - Single filter operations', () => {
    beforeEach(() => {
      criteriaGroup.add(criteriaList);
    });

    describe('Operator.EQ (Equals)', () => {
      it('should filter by exact string match', () => {
        const filter: Filter = {
          id: 'name-filter',
          leftCondition: 'name',
          operator: Operator.EQ,
          value: 'John Doe'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual(sampleData[0]);
      });

      it('should filter by exact number match', () => {
        const filter: Filter = {
          id: 'age-filter',
          leftCondition: 'age',
          operator: Operator.EQ,
          value: '30'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(1);
        expect(results[0]).toEqual(sampleData[0]);
      });

      it('should filter by boolean value', () => {
        const filter: Filter = {
          id: 'active-filter',
          leftCondition: 'active',
          operator: Operator.EQ,
          value: 'true'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(4);
        expect(results.every((item) => item.active === true)).toBe(true);
      });

      it('should return empty array when no matches found', () => {
        const filter: Filter = {
          id: 'nonexistent-filter',
          leftCondition: 'name',
          operator: Operator.EQ,
          value: 'Nonexistent Person'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search();
        expect(results).toEqual([]);
      });
    });

    describe('Operator.GT (Greater Than)', () => {
      it('should filter by greater than number', () => {
        const filter: Filter = {
          id: 'age-gt-filter',
          leftCondition: 'age',
          operator: Operator.GT,
          value: '30'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(2);
        expect(results.every((item) => item.age > 30)).toBe(true);
      });

      it('should filter by greater than salary', () => {
        const filter: Filter = {
          id: 'salary-gt-filter',
          leftCondition: 'salary',
          operator: Operator.GT,
          value: '50000'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(3);
        expect(results.every((item) => item.salary > 50000)).toBe(true);
      });

      it('should return empty array when no values are greater', () => {
        const filter: Filter = {
          id: 'age-gt-high-filter',
          leftCondition: 'age',
          operator: Operator.GT,
          value: '100'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search();
        expect(results).toEqual([]);
      });
    });

    describe('Operator.LT (Less Than)', () => {
      it('should filter by less than number', () => {
        const filter: Filter = {
          id: 'age-lt-filter',
          leftCondition: 'age',
          operator: Operator.LT,
          value: '30'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(3);
        expect(results.every((item) => item.age < 30)).toBe(true);
      });

      it('should filter by less than salary', () => {
        const filter: Filter = {
          id: 'salary-lt-filter',
          leftCondition: 'salary',
          operator: Operator.LT,
          value: '50000'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(2);
        expect(results.every((item) => item.salary < 50000)).toBe(true);
      });
    });

    describe('Operator.C (Contains)', () => {
      it('should filter by string contains (case insensitive)', () => {
        const filter: Filter = {
          id: 'name-contains-filter',
          leftCondition: 'name',
          operator: Operator.C,
          value: 'john'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(2);
        expect(results[0].name).toBe('John Doe');
        expect(results[1].name).toBe('Bob Johnson');
      });

      it('should filter by email domain', () => {
        const filter: Filter = {
          id: 'email-contains-filter',
          leftCondition: 'email',
          operator: Operator.C,
          value: 'gmail.com'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(3);
        expect(results.every((item) => item.email.includes('gmail.com'))).toBe(
          true
        );
      });

      it('should handle partial matches', () => {
        const filter: Filter = {
          id: 'department-contains-filter',
          leftCondition: 'department',
          operator: Operator.C,
          value: 'i'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(5); // IT (3 users), Finance (1 user), Marketing (1 user)
        expect(results.some((item) => item.department === 'IT')).toBe(true);
        expect(results.some((item) => item.department === 'Finance')).toBe(
          true
        );
        expect(results.some((item) => item.department === 'Marketing')).toBe(
          true
        );
      });
    });

    describe('Operator.NC (Not Contains)', () => {
      it('should filter by string not contains (case insensitive)', () => {
        const filter: Filter = {
          id: 'name-not-contains-filter',
          leftCondition: 'name',
          operator: Operator.NC,
          value: 'john'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(4);
        expect(
          results.every((item) => !item.name.toLowerCase().includes('john'))
        ).toBe(true);
      });

      it('should exclude specific email domains', () => {
        const filter: Filter = {
          id: 'email-not-contains-filter',
          leftCondition: 'email',
          operator: Operator.NC,
          value: 'gmail.com'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(3);
        expect(results.every((item) => !item.email.includes('gmail.com'))).toBe(
          true
        );
      });
    });

    describe('Operator.RGX (Regex)', () => {
      it('should filter by regex pattern', () => {
        const filter: Filter = {
          id: 'name-regex-filter',
          leftCondition: 'name',
          operator: Operator.RGX,
          value: '^J.*'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(2);
        expect(results[0].name).toBe('John Doe');
        expect(results[1].name).toBe('Jane Smith');
      });

      it('should filter by email regex pattern', () => {
        const filter: Filter = {
          id: 'email-regex-filter',
          leftCondition: 'email',
          operator: Operator.RGX,
          value: '^[a-z]+@gmail\\.com$'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(3);
        expect(
          results.every((item) => /^[a-z]+@gmail\.com$/.test(item.email))
        ).toBe(true);
      });

      it('should handle complex regex patterns', () => {
        const filter: Filter = {
          id: 'age-regex-filter',
          leftCondition: 'age',
          operator: Operator.RGX,
          value: '^[23]\\d$'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search() as TestUser[];
        expect(results).toHaveLength(5); // Ages 30, 25, 35, 28, 22 (all except 40)
        expect(results.every((item) => /^[23]\d$/.test(String(item.age)))).toBe(
          true
        );
      });

      it('should return empty array for invalid regex matches', () => {
        const filter: Filter = {
          id: 'invalid-regex-filter',
          leftCondition: 'name',
          operator: Operator.RGX,
          value: '^Z.*'
        };
        criteriaList.add(filter);

        const results = criteriaSearch.search();
        expect(results).toEqual([]);
      });
    });
  });

  describe('search() - Multiple filters (OR conditions)', () => {
    beforeEach(() => {
      criteriaGroup.add(criteriaList);
    });

    it('should apply OR logic between multiple filters in same criteria list', () => {
      const filter1: Filter = {
        id: 'name-filter-1',
        leftCondition: 'name',
        operator: Operator.EQ,
        value: 'John Doe'
      };
      const filter2: Filter = {
        id: 'name-filter-2',
        leftCondition: 'name',
        operator: Operator.EQ,
        value: 'Jane Smith'
      };

      criteriaList.add(filter1);
      criteriaList.add(filter2);

      const results = criteriaSearch.search() as TestUser[];
      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('John Doe');
      expect(results[1].name).toBe('Jane Smith');
    });

    it('should handle mixed operators in OR conditions', () => {
      const filter1: Filter = {
        id: 'age-eq-filter',
        leftCondition: 'age',
        operator: Operator.EQ,
        value: '30'
      };
      const filter2: Filter = {
        id: 'department-filter',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'HR'
      };

      criteriaList.add(filter1);
      criteriaList.add(filter2);

      const results = criteriaSearch.search() as TestUser[];
      expect(results).toHaveLength(2);
      expect(results.some((item) => item.age === 30)).toBe(true);
      expect(results.some((item) => item.department === 'HR')).toBe(true);
    });
  });

  describe('search() - Multiple criteria lists (AND conditions)', () => {
    it('should apply AND logic between different criteria lists', () => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();

      const filter1: Filter = {
        id: 'department-filter',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'IT'
      };
      const filter2: Filter = {
        id: 'age-filter',
        leftCondition: 'age',
        operator: Operator.GT,
        value: '30'
      };

      criteriaList1.add(filter1);
      criteriaList2.add(filter2);
      criteriaGroup.add(criteriaList1);
      criteriaGroup.add(criteriaList2);

      const results = criteriaSearch.search() as TestUser[];
      expect(results).toHaveLength(2);
      expect(
        results.every((item) => item.department === 'IT' && item.age > 30)
      ).toBe(true);
    });

    it('should handle complex AND/OR combinations', () => {
      const criteriaList1 = new CriteriaList();
      const criteriaList2 = new CriteriaList();

      // First criteria list: department = 'IT' OR department = 'HR'
      const filter1: Filter = {
        id: 'dept-it-filter',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'IT'
      };
      const filter2: Filter = {
        id: 'dept-hr-filter',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'HR'
      };

      // Second criteria list: active = true
      const filter3: Filter = {
        id: 'active-filter',
        leftCondition: 'active',
        operator: Operator.EQ,
        value: 'true'
      };

      criteriaList1.add(filter1);
      criteriaList1.add(filter2);
      criteriaList2.add(filter3);
      criteriaGroup.add(criteriaList1);
      criteriaGroup.add(criteriaList2);

      const results = criteriaSearch.search() as TestUser[];
      expect(results).toHaveLength(3);
      expect(
        results.every(
          (item) =>
            (item.department === 'IT' || item.department === 'HR') &&
            item.active === true
        )
      ).toBe(true);
    });
  });

  describe('search() - Edge cases', () => {
    beforeEach(() => {
      criteriaGroup.add(criteriaList);
    });

    it('should skip filters with empty values', () => {
      const filter1: Filter = {
        id: 'empty-value-filter',
        leftCondition: 'name',
        operator: Operator.EQ,
        value: ''
      };
      const filter2: Filter = {
        id: 'valid-filter',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'IT'
      };

      criteriaList.add(filter1);
      criteriaList.add(filter2);

      const results = criteriaSearch.search() as TestUser[];
      expect(results).toHaveLength(3); // Only IT department filter should apply
      expect(results.every((item) => item.department === 'IT')).toBe(true);
    });

    it('should handle object values by converting to JSON string', () => {
      const dataWithObjects = [
        {
          id: 1,
          name: 'John',
          metadata: { role: 'admin', permissions: ['read', 'write'] }
        },
        {
          id: 2,
          name: 'Jane',
          metadata: { role: 'user', permissions: ['read'] }
        }
      ];

      const searchWithObjects = new CriteriaSearch(
        dataWithObjects,
        criteriaGroup
      );

      const filter: Filter = {
        id: 'metadata-filter',
        leftCondition: 'metadata',
        operator: Operator.C,
        value: 'admin'
      };
      criteriaList.add(filter);

      const results = searchWithObjects.search() as Array<{
        id: number;
        name: string;
        metadata: any;
      }>;
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('John');
    });

    it('should handle nonexistent properties gracefully', () => {
      const filter: Filter = {
        id: 'nonexistent-prop-filter',
        leftCondition: 'nonExistentProperty',
        operator: Operator.EQ,
        value: 'someValue'
      };
      criteriaList.add(filter);

      const results = criteriaSearch.search();
      expect(results).toEqual([]);
    });

    it('should handle undefined operator gracefully', () => {
      const filter: Filter = {
        id: 'undefined-operator-filter',
        leftCondition: 'name',
        operator: 'INVALID_OPERATOR' as Operator,
        value: 'John'
      };
      criteriaList.add(filter);

      const results = criteriaSearch.search();
      expect(results).toEqual([]);
    });

    it('should handle numeric strings correctly', () => {
      const filter: Filter = {
        id: 'numeric-string-filter',
        leftCondition: 'id',
        operator: Operator.GT,
        value: '3'
      };
      criteriaList.add(filter);

      const results = criteriaSearch.search() as TestUser[];
      expect(results).toHaveLength(3);
      expect(results.every((item) => item.id > 3)).toBe(true);
    });
  });

  describe('search() - Performance and data integrity', () => {
    it('should not modify original data array', () => {
      const originalData = [...sampleData];
      criteriaGroup.add(criteriaList);

      const filter: Filter = {
        id: 'test-filter',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'IT'
      };
      criteriaList.add(filter);

      criteriaSearch.search();

      expect(sampleData).toEqual(originalData);
    });

    it('should handle large datasets efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, index) => ({
        id: index,
        name: `User ${index}`,
        department: index % 2 === 0 ? 'IT' : 'HR',
        age: 20 + (index % 50)
      }));

      const largeSearch = new CriteriaSearch(largeData, criteriaGroup);
      criteriaGroup.add(criteriaList);

      const filter: Filter = {
        id: 'large-data-filter',
        leftCondition: 'department',
        operator: Operator.EQ,
        value: 'IT'
      };
      criteriaList.add(filter);

      const startTime = performance.now();
      const results = largeSearch.search();
      const endTime = performance.now();

      expect(results).toHaveLength(500);
      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('should return consistent results on multiple calls', () => {
      criteriaGroup.add(criteriaList);

      const filter: Filter = {
        id: 'consistency-filter',
        leftCondition: 'active',
        operator: Operator.EQ,
        value: 'true'
      };
      criteriaList.add(filter);

      const results1 = criteriaSearch.search() as TestUser[];
      const results2 = criteriaSearch.search() as TestUser[];

      expect(results1).toEqual(results2);
    });
  });
});
