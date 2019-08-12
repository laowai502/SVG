import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cut',
})
export class CutPipe implements PipeTransform {
  
  transform(value: string, wordwise: boolean, max: any, tail: string) :any{
      if (!value) return '';
      max = parseInt(max, 10);
      if (!max) return value;
      if (value.length <= max) return value;

      value = value.substr(0, max);
      if (wordwise) {
          var lastspace = value.lastIndexOf(' ');
          if (lastspace != -1) {
          value = value.substr(0, lastspace);
          }
      }
      return value + (tail || ' …');
    
  }
}
