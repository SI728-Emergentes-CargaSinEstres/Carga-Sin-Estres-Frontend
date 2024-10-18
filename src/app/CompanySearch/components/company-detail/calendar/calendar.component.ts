import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Event {
  date: Date;
  title: string;
  startHour: number;
  endHour: number;
  isLocked?: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  currentDate: Date = new Date();
  weekDays: Date[] = [];
  hours: number[] = [];
  events: Event[] = [];
  initialEvents = [];
  selectedEvent:any = {};

  constructor(
    public dialogRef: MatDialogRef<CalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initialEvents = data.map((item:any) => ({
      date: new Date(`${item.startDate}T${item.startTime}`), // Combina fecha y hora
      title: '', // Título vacío
      startHour: parseInt(item.startTime.split(':')[0]), // Hora de inicio
      endHour: parseInt(item.startTime.split(':')[0]) + 1, // Hora de fin (una hora después)
      isLocked: true // Marca como bloqueado
    }));
    this.events = [...this.initialEvents];
  }


  ngOnInit(): void {
    this.generateWeek(this.currentDate);
    this.generateHours();
  }

  

  generateWeek(date: Date): void {
    this.weekDays = [];
    const startOfWeek = this.getStartOfWeek(date);
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i));
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  generateHours(): void {
    this.hours = [];
    for (let i = 7; i < 18; i++) {
      this.hours.push(i);
    }
  }

  prevWeek(): void {
    const previousWeekDate = new Date(this.currentDate);
    previousWeekDate.setDate(this.currentDate.getDate() - 7);
    const startOfPreviousWeek = this.getStartOfWeek(previousWeekDate);
    const startOfCurrentWeek = this.getStartOfWeek(new Date());

    if (startOfPreviousWeek >= startOfCurrentWeek) {
      this.currentDate = previousWeekDate;
      this.generateWeek(this.currentDate);
    }
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateWeek(this.currentDate);
  }

  addEvent(day: Date, hour: number): void {

    day = new Date(day.setHours(hour, 0, 0, 0));
    
    if (day < new Date()) {
      alert("No puedes seleccionar fechas pasadas.");
      return;
    }

    this.events = [...this.initialEvents];

    this.selectedEvent = {
      date: day,
      title: 'Selected',
      startHour: hour,
      endHour: hour + 1
    };

    this.events.push(this.selectedEvent);
  }

  getEventsForDayAndHour(day: Date, hour: number): Event[] {
    return this.events.filter(event => 
      event.date.toDateString() === day.toDateString() &&
      event.startHour === hour
    );
  }

  save(): void {
    if (this.events.length > 0) {
      this.dialogRef.close(this.selectedEvent);
    } else {
      this.dialogRef.close();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
