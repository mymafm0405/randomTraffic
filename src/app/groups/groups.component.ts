import { StudentServiceService } from './../shared/student-service.service';
import { Group } from './../shared/group.model';
import { GroupServiceService } from './../shared/group-service.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Student } from '../shared/student.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  constructor(private groupService: GroupServiceService, private http: HttpClient, private studentService: StudentServiceService) { }

  ngOnInit() {
    // Get groups
    this.http.get('https://random-select.firebaseio.com/groups.json')
    .pipe(map(
      (resGroups) => {
        const groupsArray = [];
        for (const key in resGroups) {
          if (resGroups.hasOwnProperty(key)) {
            groupsArray.push(resGroups[key]);
          }
        }
        return groupsArray;
      }
    ))
    .subscribe(
      (groupsData: Group[]) => {
        this.groupService.groups = groupsData;
        this.groups = groupsData;
      }
    );
    // Get students data
    this.getStudentsData();
    //
    // when new students get added
    this.studentService.studentAdded.subscribe(
      () => {
        this.getStudentsData();
      }
    );
    //
    // Subscribe for groups changes
    this.groupService.groupsChanged.subscribe(
      (updatedGroups: Group[]) => {
        this.groups = updatedGroups;
      }
    );
    //
  }

  getStudentsData() {
    // Get students
    this.http.get('https://random-select.firebaseio.com/students.json')
    .pipe(map(
      (resStudents) => {
        const studentsArray = [];
        const studentsArrayWithFireId = [];
        for (const key in resStudents) {
          if (resStudents.hasOwnProperty(key)) {
            studentsArrayWithFireId.push({...resStudents[key], fireId: key});
            studentsArray.push(resStudents[key]);
          }
        }
        this.studentService.studentsArrayWithFireId = studentsArrayWithFireId;
        return studentsArray;
      }
    ))
    .subscribe(
      (studentsData: Student[]) => {
        this.studentService.students = studentsData;
      }
    );
    //
  }

}
