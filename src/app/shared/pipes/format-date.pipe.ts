import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true, // Agrega esta línea para hacerlo standalone
})
export class FormatDatePipe implements PipeTransform {
  transform(isoDate: string): string {
    const date = new Date(isoDate);
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(
      date.getMinutes(),
    )}:${pad(date.getSeconds())}`;
  }
}
