import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Event {
  date: Date;
  title: string;
  startHour: number;
  endHour: number;
  isLocked?: boolean;
  status: string;
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
  timeblock:any = {};

  constructor(
    public dialogRef: MatDialogRef<CalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initialEvents = data.events.map((item:any) => ({
      date: new Date(`${item.startDate}T${item.startTime}`), // Combina fecha y hora
      title: '', // Título vacío
      startHour: parseInt(item.startTime.split(':')[0]), // Hora de inicio
      endHour: parseInt(item.startTime.split(':')[0]) + 1, // Hora de fin (una hora después)
      isLocked: true, // Marca como bloqueado
      status: item.status
    }));
    this.initialEvents = this.initialEvents.filter((e:Event) => e.status !== 'cancelled');
    this.events = [...this.initialEvents];
    this.timeblock = data.timeblock;
    console.log(this.timeblock);
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

    const startHour = parseInt(this.timeblock.startTime.split(':')[0], 10);
  const endHour = parseInt(this.timeblock.endTime.split(':')[0], 10);

  for (let i = startHour; i <= endHour; i++) {
    this.hours.push(i);
  }
  }

  prevWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateWeek(this.currentDate);
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
