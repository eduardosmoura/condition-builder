import { Filter, Operator } from 'types';
import { CriteriaGroup } from '../CriteriaGroup/CriteriaGroup';

/**
 * Generic type for searchable data objects
 */
type SearchableData = Record<string, unknown>;

/**
 * Options for configuring search behavior
 */
interface SearchOptions {
  /** Whether to perform case-sensitive string comparisons */
  caseSensitive?: boolean;
  /** Whether to handle regex errors gracefully */
  safeRegex?: boolean;
}

/**
 * CriteriaSearch class for filtering data based on dynamic criteria
 * Supports AND/OR logical operations with various comparison operators
 */
export class CriteriaSearch<T extends SearchableData = SearchableData> {
  private readonly data: T[];
  private readonly criteriaGroup: CriteriaGroup;
  private readonly options: Required<SearchOptions>;

  constructor(
    data: T[],
    criteriaGroup: CriteriaGroup,
    options: SearchOptions = {}
  ) {
    this.data = data;
    this.criteriaGroup = criteriaGroup;
    this.options = {
      caseSensitive: false,
      safeRegex: true,
      ...options
    };
  }

  /**
   * Performs the search operation and returns filtered results
   * @returns Array of filtered data objects
   */
  search(): T[] {
    // Early return for empty criteria - no filtering needed
    if (this.criteriaGroup.all().length === 0) {
      return [...this.data];
    }

    // Use filter instead of forEach for better functional programming
    return this.data.filter((item) => this.matchesAllCriteria(item));
  }

  /**
   * Checks if a data item matches all criteria groups (AND logic)
   * @param item - The data item to evaluate
   * @returns True if the item matches all criteria groups
   */
  private matchesAllCriteria(item: T): boolean {
    const criteriaLists = this.criteriaGroup.all();

    // All criteria groups must be satisfied (AND logic)
    return criteriaLists.every((criteriaList) => {
      const filters = criteriaList.all();
      const validFilters = filters.filter((filter) =>
        this.isValidFilter(filter)
      );

      // If no valid filters in this group, consider it as satisfied
      if (validFilters.length === 0) {
        return true;
      }

      // At least one filter in the group must match (OR logic)
      return validFilters.some((filter) => this.evaluateFilter(item, filter));
    });
  }

  /**
   * Validates if a filter has the minimum required data
   * @param filter - The filter to validate
   * @returns True if the filter is valid
   */
  private isValidFilter(filter: Filter): boolean {
    return (
      filter.value.trim().length > 0 && filter.leftCondition.trim().length > 0
    );
  }

  /**
   * Evaluates a single filter against a data item
   * @param item - The data item to evaluate
   * @param filter - The filter to apply
   * @returns True if the filter matches the item
   */
  private evaluateFilter(item: T, filter: Filter): boolean {
    try {
      const fieldValue = this.getFieldValue(item, filter.leftCondition);

      // Handle null/undefined values consistently
      if (fieldValue === null || fieldValue === undefined) {
        return false;
      }

      return this.applyOperator(fieldValue, filter.operator, filter.value);
    } catch (error) {
      // Log error in development, but don't break the search
      if (process.env.NODE_ENV === 'development') {
        console.warn('Filter evaluation error:', error, { filter, item });
      }
      return false;
    }
  }

  /**
   * Safely retrieves a field value from a data item
   * @param item - The data item
   * @param fieldName - The field name to retrieve
   * @returns The field value or undefined if not found
   */
  private getFieldValue(item: T, fieldName: string): unknown {
    // Handle nested field access (e.g., "user.name")
    if (fieldName.includes('.')) {
      return this.getNestedValue(item, fieldName);
    }

    return item[fieldName];
  }

  /**
   * Retrieves nested field values using dot notation
   * @param obj - The object to traverse
   * @param path - The dot-separated path
   * @returns The nested value or undefined
   */
  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object' && key in current
        ? (current as Record<string, unknown>)[key]
        : undefined;
    }, obj);
  }

  /**
   * Applies the specified operator to compare values
   * @param fieldValue - The actual field value
   * @param operator - The comparison operator
   * @param filterValue - The filter value to compare against
   * @returns True if the comparison passes
   */
  private applyOperator(
    fieldValue: unknown,
    operator: Operator,
    filterValue: string
  ): boolean {
    switch (operator) {
      case Operator.EQ:
        return this.evaluateEquals(fieldValue, filterValue);
      case Operator.GT:
        return this.evaluateGreaterThan(fieldValue, filterValue);
      case Operator.LT:
        return this.evaluateLessThan(fieldValue, filterValue);
      case Operator.C:
        return this.evaluateContains(fieldValue, filterValue);
      case Operator.NC:
        return this.evaluateNotContains(fieldValue, filterValue);
      case Operator.RGX:
        return this.evaluateRegex(fieldValue, filterValue);
      default:
        return false;
    }
  }

  /**
   * Evaluates equality comparison with type-aware logic
   */
  private evaluateEquals(fieldValue: unknown, filterValue: string): boolean {
    // Handle boolean values
    if (typeof fieldValue === 'boolean') {
      return String(fieldValue) === filterValue.toLowerCase();
    }

    // Handle numeric values
    if (typeof fieldValue === 'number') {
      const numericFilterValue = Number(filterValue);
      return !isNaN(numericFilterValue) && fieldValue === numericFilterValue;
    }

    // Handle string values
    const stringValue = this.convertToString(fieldValue);
    return this.options.caseSensitive
      ? stringValue === filterValue
      : stringValue.toLowerCase() === filterValue.toLowerCase();
  }

  /**
   * Evaluates greater than comparison (numeric only)
   */
  private evaluateGreaterThan(
    fieldValue: unknown,
    filterValue: string
  ): boolean {
    const numericField = Number(fieldValue);
    const numericFilter = Number(filterValue);

    return (
      !isNaN(numericField) &&
      !isNaN(numericFilter) &&
      numericField > numericFilter
    );
  }

  /**
   * Evaluates less than comparison (numeric only)
   */
  private evaluateLessThan(fieldValue: unknown, filterValue: string): boolean {
    const numericField = Number(fieldValue);
    const numericFilter = Number(filterValue);

    return (
      !isNaN(numericField) &&
      !isNaN(numericFilter) &&
      numericField < numericFilter
    );
  }

  /**
   * Evaluates contains comparison (string operations)
   */
  private evaluateContains(fieldValue: unknown, filterValue: string): boolean {
    const stringValue = this.convertToString(fieldValue);

    return this.options.caseSensitive
      ? stringValue.includes(filterValue)
      : stringValue.toLowerCase().includes(filterValue.toLowerCase());
  }

  /**
   * Evaluates not contains comparison (string operations)
   */
  private evaluateNotContains(
    fieldValue: unknown,
    filterValue: string
  ): boolean {
    return !this.evaluateContains(fieldValue, filterValue);
  }

  /**
   * Evaluates regex pattern matching with safe error handling
   */
  private evaluateRegex(fieldValue: unknown, filterValue: string): boolean {
    try {
      const regex = new RegExp(
        filterValue,
        this.options.caseSensitive ? '' : 'i'
      );
      const stringValue = this.convertToString(fieldValue);
      return regex.test(stringValue);
    } catch (error) {
      if (this.options.safeRegex) {
        // In safe mode, invalid regex patterns return false
        return false;
      }
      throw error;
    }
  }

  /**
   * Converts any value to string representation for string operations
   * @param value - The value to convert
   * @returns String representation of the value
   */
  private convertToString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }
}
