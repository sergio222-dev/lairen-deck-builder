import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export const NULL_VALUES = ['-'];

export enum FilterType {
  ILIKE,
  IN,
  ORDER,
  RANGE,
}

export interface FilterCriterion {
  field: string;
  value: string [];
  type: FilterType;
}

export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Page {
  page: number;
  size: number;
  pages: number;
}

export interface Specification<T = PostgrestFilterBuilder<any, any, any, any>> {
  apply(query: T): T;
}

export class IlikeSpecification implements Specification<PostgrestFilterBuilder<any, any, any, any>> {

  constructor(private fields: string[], private values: string[], private exclusive = true) {
  }

  apply(query: PostgrestFilterBuilder<any, any, any, any>): PostgrestFilterBuilder<any, any, any, any> {
    if (this.values.length === 0) {
      return query;
    }

    if (this.exclusive) {
      const ilikeQueries = this.values.map(v => {
        return this.fields.map(f => {
          return `${f}.ilike.%${v}%`;
        }).join(',');
      });

      ilikeQueries.forEach((q) => {
        void query.or(q);
      });

      return query;
    } else {
      // construct the syntax for or ilike
      const ilikeQueries = this.fields.map(f => {
        return this.values.map(v => {
          return `${f}.ilike.%${v}%`;
        }).join(',');
      }).join(',');

      return query.or(ilikeQueries);
    }
  }
}

export class RangeFilter implements Specification<PostgrestFilterBuilder<any, any, any, any>> {
  constructor(private from: number, private to: number) {
  }

  apply(query: PostgrestFilterBuilder<any, any, any, any>): PostgrestFilterBuilder<any, any, any, any> {
    return query.range(this.from, this.to - 1);
  }
}

export class OrderFilter implements Specification<PostgrestFilterBuilder<any, any, any, any>> {
  constructor(private field: string, private order: 'asc' | 'desc' = 'asc') {
  }

  apply(query: PostgrestFilterBuilder<any, any, any, any>): PostgrestFilterBuilder<any, any, any, any> {
    return query.order(this.field, { ascending: this.order === 'asc' });
  }
}

export class InSpecification implements Specification<PostgrestFilterBuilder<any, any, any, any>> {
  private readonly exclusive: boolean;

  constructor(private fields: string[], private values: string[], exclusive?: boolean) {
    this.exclusive = exclusive ?? false;
  }

  apply(query: PostgrestFilterBuilder<any, any, any, any>): PostgrestFilterBuilder<any, any, any, any> {
    if (this.values.length === 0) {
      return query;
    }

    if (this.exclusive) {

      if (this.values.length === 1) {

        const o = this.fields.map(f => {
          return `${f}.in.(${this.values.join(',')})`;
        }).join(',');

        void query.or(o);

        return query;
      } else {

        this.fields.forEach(f => {
          void query.in(f, [...this.values]);
        });

        return query;
      }

    } else {

      const o = this.fields.map(f => {
        return `${f}.in.(${this.values.join(',')})`;
      }).join(',');

      void query.or(o);

      return query;
    }
  }
}
