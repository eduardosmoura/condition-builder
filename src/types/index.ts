export enum Operator {
  'EQ' = 'Equals',
  'GT' = 'Greater Than',
  'LT' = 'Less Than',
  'C' = 'Contains',
  'NC' = 'Not Contains',
  'RGX' = 'Regex'
}

export interface Result {
  data: object[];
  columns: string[];
}

export interface Filter {
  id: string;
  leftCondition: string;
  operator: Operator;
  value: string;
}
