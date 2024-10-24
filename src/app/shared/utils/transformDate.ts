export interface MonthsOfYear {
  [key: string]: string;
}

export class UtilsService {
  // Método para formatear fechas al formato "Miércoles, 23 Enero 2023"
  static formatDateToReadableString(dateString: string): string {
    const date = new Date(dateString);

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthsOfYear = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // Usar UTC para evitar problemas de zona horaria
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const dayOfMonth = date.getUTCDate();
    const month = monthsOfYear[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
  }

  // Método para convertir una fecha a formato YYYY-MM-DD, admitiendo formatos como "Viernes, 1 Agosto 2025"
  static formatDateToYYYYMMDD(dateString: string): string {
    console.log('dato recibido: ', dateString);

    // Eliminar el día de la semana del string
    const parts = dateString.split(', ')[1]; // Tomar la parte que contiene "1 Agosto 2025"

    // Separar el día, mes y año
    const [day, month, year] = parts.split(' ');

    const monthsOfYear = {
      Enero: '01',
      Febrero: '02',
      Marzo: '03',
      Abril: '04',
      Mayo: '05',
      Junio: '06',
      Julio: '07',
      Agosto: '08',
      Septiembre: '09',
      Octubre: '10',
      Noviembre: '11',
      Diciembre: '12',
    } as MonthsOfYear;

    // Verificar si el mes es válido
    if (!monthsOfYear[month]) {
      throw new Error('Fecha inválida');
    }

    // Construir la fecha en formato YYYY-MM-DD
    const formattedDate = `${year}-${monthsOfYear[month]}-${day.padStart(2, '0')}`;

    // Crear un objeto Date para verificar si la fecha es válida
    const date = new Date(formattedDate);
    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }

    return formattedDate;
  }

  // Convertir número serial de Excel a fecha y hora en formato "YYYY-MM-DD HH:mm:ss"
  static excelSerialToDate(serial: number): string {
    if (serial <= 0) {
      throw new Error('Número serial de Excel inválido');
    }

    // Ajustar por el error de año bisiesto de Excel (si serial > 60, restar 1)
    if (serial > 60) {
      serial -= 1;
    }

    const excelEpoch = new Date(1900, 0, 1); // 1 de enero de 1900
    const days = Math.floor(serial);
    const fraction = serial - days;

    // Calcular la fecha
    const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);

    // Restar un día para corregir la fecha
    date.setDate(date.getDate() - 1);

    // Calcular la hora
    const totalSeconds = Math.round(fraction * 24 * 60 * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Formatear la fecha y hora
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`;

    return `${formattedDate} ${formattedTime}`;
  }

  // Formatear el campo 'entry' al formato "YYYY-MM-DD HH:mm:ss"
  static formatEntryDateTime(dateTime: string | number | undefined): string {
    if (dateTime === undefined || dateTime === null) {
      console.error('Formato de HORA_ENTRADA inválido: undefined');
      return 'Invalid DateTime';
    }

    let dateObj: Date;
    let formattedDateTime: string;

    if (typeof dateTime === 'number') {
      // Convertir número serial de Excel a fecha y hora
      try {
        formattedDateTime = this.excelSerialToDate(dateTime);
      } catch (error) {
        console.error('Error al convertir serial de Excel:', error);
        return 'Invalid DateTime';
      }
    } else if (typeof dateTime === 'string') {
      // Manejar formatos de fecha como "02/07/2024 16:16:26"
      if (dateTime.includes('/')) {
        try {
          const [datePart, timePart] = dateTime.trim().split(' ');
          if (!timePart) {
            throw new Error('Falta la parte de la hora');
          }
          const [day, month, year] = datePart.split('/').map(Number);
          const [hours, minutes, seconds] = timePart.split(':').map(Number);

          // Crear objeto Date en hora local
          dateObj = new Date(year, month - 1, day, hours, minutes, seconds);

          if (isNaN(dateObj.getTime())) {
            throw new Error('Fecha inválida');
          }

          // Restar un día para corregir la fecha
          dateObj.setDate(dateObj.getDate() - 1);

          // Formatear como "YYYY-MM-DD HH:mm:ss"
          const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(
            dateObj.getDate(),
          ).padStart(2, '0')}`;
          const formattedTime = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(
            2,
            '0',
          )}:${String(dateObj.getSeconds()).padStart(2, '0')}`;

          formattedDateTime = `${formattedDate} ${formattedTime}`;
        } catch (error) {
          console.error('Error al formatear la fecha y hora:', error);
          return 'Invalid DateTime';
        }
      } else {
        console.error('Formato de HORA_ENTRADA inválido:', dateTime);
        return 'Invalid DateTime';
      }
    } else {
      console.error('Formato de HORA_ENTRADA inválido:', dateTime);
      return 'Invalid DateTime';
    }

    return formattedDateTime;
  }
}
