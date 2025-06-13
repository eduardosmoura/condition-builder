/**
 * Generic criteria collection class for managing a list of items
 * Provides methods for adding, removing, accessing, and manipulating criteria
 * @template T - The type of items stored in the criteria collection
 */
export class Criteria<T> {
  /** Internal array to store the criteria items */
  private terms: T[];

  /**
   * Creates a new empty Criteria collection
   */
  constructor() {
    this.terms = [];
  }

  /**
   * Returns all items in the criteria collection
   * @returns Array containing all criteria items
   */
  all(): T[] {
    return this.terms;
  }

  /**
   * Gets the number of items in the criteria collection
   * @returns The total count of criteria items
   */
  size(): number {
    return this.terms.length;
  }

  /**
   * Removes all items from the criteria collection
   */
  clear(): void {
    this.terms = [];
  }

  /**
   * Retrieves a specific item by its index position
   * @param index - The zero-based index of the item to retrieve
   * @returns The item at the specified index
   */
  get(index: number): T {
    return this.terms[index];
  }

  /**
   * Updates an item at a specific index position
   * @param index - The zero-based index of the item to update
   * @param value - The new value to set at the specified index
   */
  set(index: number, value: T): void {
    this.terms[index] = value;
  }

  /**
   * Adds a new item to the end of the criteria collection
   * @param value - The item to add to the collection
   */
  add(value: T): void {
    this.terms.push(value);
  }

  /**
   * Inserts a new item at the specified index position
   * All items at and after the insertion point are shifted to the right
   * @param index - The zero-based index where the new item should be inserted
   * @param value - The item to insert into the collection
   */
  insert(index: number, value: T): void {
    this.terms.splice(index + 1, 0, value);
  }

  /**
   * Removes an item at the specified index position
   * All items after the removal point are shifted to the left
   * @param index - The zero-based index of the item to remove
   */
  remove(index: number): void {
    this.terms.splice(index, 1);
  }
}
