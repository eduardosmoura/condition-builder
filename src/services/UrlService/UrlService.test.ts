import fs from 'fs';
import path from 'path';
import { UrlService } from './UrlService';

describe('UrlService', () => {
  it('should parse data', async () => {
    const array = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'tests/fixtures/todos.json'),
        'utf-8'
      )
    );
    const urlService = new UrlService('todos.json');
    const data = urlService.parseResult(array);
    expect(data.columns.length).toEqual(4);
    expect(data.data.length).toEqual(200);
  });
});
