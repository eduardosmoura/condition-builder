import { Result } from 'types';

export class UrlService {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async fetchResult(): Promise<Result> {
    try {
      const response = await fetch(this.url);
      const json = await response.json();
      if (json.error) {
        throw new Error(json.message);
      }
      return this.parseResult(json);
    } catch (error) {
      throw new Error('Error loading data from url');
    }
  }

  parseResult(json: object[]): Result {
    if (!json.length) {
      throw new Error('Error parsing data from url');
    }
    const columns = Object.keys(json[0]);
    const data: Result = {
      columns: columns,
      data: json
    };
    return data;
  }
}
