import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Student } from './student.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {
  students: Student[] = [];
  studentsChanged = new Subject<Student[]>();
  studentAdded = new Subject<boolean>();
  selectedStudentChanged = new Subject<Student>();
  currentGroupStudentsChanged = new Subject<Student[]>();
  selectedStudent: Student;
  currentGroupStudents: Student[];
  studentsArrayWithFireId: any[];

  constructor(private http: HttpClient) { }

  addStudent(newStudent: Student) {
    this.http.post('https://random-select.firebaseio.com/students.json', newStudent)
    .subscribe(
      () => {
        this.students.push(newStudent);
        this.students = this.students.slice();
        this.studentsChanged.next(this.students);
        this.studentAdded.next(true);
        console.log('Students added successfully!');
      }
    );
  }

  removeStudent(studentId: number) {
    const fireId = this.studentsArrayWithFireId.find(student => student.id === studentId).fireId;
    this.http.delete('https://random-select.firebaseio.com/students/' + fireId + '.json')
    .subscribe(
      () => {
        console.log('Student has been deleted!');
      }
    );
  }
}
