import fs from 'fs';
import 'jest';
import { UrlService } from './UrlService';

describe('UrlService', () => {
  it('should parse data', async () => {
    const array = JSON.parse(
      fs.readFileSync('./tests/fixtures/todos.json', 'utf-8')
    );
    const urlService = new UrlService('todos.json');
    const data = urlService.parseResult(array);
    expect(data.columns.length).toEqual(4);
    expect(data.data.length).toEqual(200);
  });
});
