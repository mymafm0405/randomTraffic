import { StudentServiceService } from './../../shared/student-service.service';
import { GroupServiceService } from './../../shared/group-service.service';
import { Group } from './../../shared/group.model';
import { Component, OnInit, Input } from '@angular/core';
import { Student } from 'src/app/shared/student.model';

@Component({
  selector: 'app-group-icon',
  templateUrl: './group-icon.component.html',
  styleUrls: ['./group-icon.component.css']
})
export class GroupIconComponent implements OnInit {
  groups: Group[];
  showAddStudentForm = false;
  currentIndex: number;
  selectedStudent: Student;
  randomClicked = false;
  timeOut: any;
  editClickedStatus = false;
  choosedStudentsArray: Student[] = [];

  constructor(private groupService: GroupServiceService, private studentService: StudentServiceService) { }

  ngOnInit() {
    this.groups = this.groupService.groups;
    //
    this.groupService.groupsChanged.subscribe(
      (updatedGroups: Group[]) => {
        this.groups = updatedGroups;
      }
    );
    //
  }

  onAddStudent(groupId: number, groupIndex: number) {
    this.showAddStudentForm = !this.showAddStudentForm;
    this.currentIndex = groupIndex;
    this.groupService.groupId = groupId;
  }

  onOutsideClick() {
    this.showAddStudentForm = false;
    this.currentIndex = null;
  }

  onRandom(groupId: number, groupIndex: number) {
    clearTimeout(this.timeOut);
    this.currentIndex = groupIndex;
    this.randomClicked = true;
    this.timeOut = setTimeout(() => {
      this.randomClicked = false;
    }, 10000);
    //
    let currentGroupStudents = this.studentService.students.filter(student => student.groupId === groupId);
    if (this.choosedStudentsArray.length > 0) {
      for (const stu of this.choosedStudentsArray) {
        currentGroupStudents = currentGroupStudents.filter(st => st.id !== stu.id);
        console.log(currentGroupStudents);
      }
    }
    console.log(currentGroupStudents);
    if (currentGroupStudents.length <= 1) {
      currentGroupStudents = this.studentService.students.filter(student => student.groupId === groupId);
      this.choosedStudentsArray = [];
    }
    this.studentService.currentGroupStudents = currentGroupStudents;
    this.studentService.currentGroupStudentsChanged.next(currentGroupStudents);
    const indexNumber = Math.floor(Math.random() * currentGroupStudents.length);
    this.selectedStudent = currentGroupStudents[indexNumber];
    this.choosedStudentsArray.push(this.selectedStudent);
    //
    this.groupService.randomClicked.next(true);
    this.studentService.selectedStudent = this.selectedStudent;
    this.studentService.selectedStudentChanged.next(this.selectedStudent);
    this.groupService.groupIndex = groupIndex;
    this.groupService.groupIndexChanged.next(groupIndex);
  }

  onEdit(groupId: number, groupIndex: number) {
    if (groupIndex === this.currentIndex || this.currentIndex === undefined) {
      this.editClickedStatus = !this.editClickedStatus;
      console.log(this.currentIndex);
      console.log(groupIndex);
    } else if (this.currentIndex !== groupIndex) {
      this.editClickedStatus = true;
    }
    this.currentIndex = groupIndex;
    this.groupService.groupIdChanged.next(groupId);
    this.groupService.groupId = groupId;
    this.groupService.editClicked.next(this.editClickedStatus);
  }
}
