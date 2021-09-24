import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { GroupServiceService } from './../../shared/group-service.service';
import { StudentServiceService } from './../../shared/student-service.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Student } from 'src/app/shared/student.model';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-student-data',
  templateUrl: './student-data.component.html',
  styleUrls: ['./student-data.component.css']
})
export class StudentDataComponent implements OnInit {
  // @ViewChild('editForm', {static: false}) editForm: NgForm;
  currentGroupId: number;
  students: Student[] = [];
  currentStudentEdit: Student;
  currentStudentIndex: number;
  showEditForm = false;
  editForm: FormGroup;
  savedSuccess = false;
  timeOut: any;
  savingProcess = false;
  studentFireId: string;
  selectedImage: any;
  currentStudentId: number;

  constructor(
    private studentService: StudentServiceService,
    private groupService: GroupServiceService,
    private http: HttpClient,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      studentName: new FormControl('null', Validators.required),
      studentImage: new FormControl(null)
    });
    this.currentGroupId = this.groupService.groupId;
    this.students = this.studentService.students.filter(student => student.groupId === this.currentGroupId);
    console.log(this.currentGroupId);
    console.log(this.students);
    //
    this.groupService.groupIdChanged.subscribe(
      (updatedGroupId: number) => {
        this.showEditForm = false;
        this.currentGroupId = updatedGroupId;
        this.students = this.studentService.students.filter(student => student.groupId === this.currentGroupId);
        console.log(this.currentGroupId);
        console.log(this.students);
      }
    );
    //
    this.studentService.studentsChanged.subscribe(
      (updatedStudents: Student[]) => {
        this.students = updatedStudents.filter(student => student.groupId === this.currentGroupId);
        console.log(this.students);
      }
    );
  }

  onRemove(studentId: number) {
    const currentStudentIndex = this.studentService.students.findIndex(student => student.id === studentId);
    // console.log(currentStudentIndex);
    // console.log(this.studentService.students);
    this.studentService.students.splice(currentStudentIndex, 1);
    // console.log(this.studentService.students);
    this.studentService.studentsChanged.next(this.studentService.students);
    this.studentService.removeStudent(studentId);
  }

  onEdit(studentId: number, studentIndex: number) {
    this.currentStudentId = studentId;
    this.savedSuccess = false;
    clearTimeout(this.timeOut);
    if (this.currentStudentIndex === undefined || this.currentStudentIndex === studentIndex) {
      this.currentStudentIndex = studentIndex;
      this.showEditForm = !this.showEditForm;
      console.log(this.currentStudentIndex);
      console.log(studentIndex);
    } else {
      this.showEditForm = true;
      this.currentStudentIndex = studentIndex;
      console.log(this.currentStudentIndex);
      console.log(studentIndex);
    }
    this.currentStudentEdit = this.students[studentIndex];
    // console.log(this.editForm);
    // this.editForm.setValue({
    //   studentName: this.currentStudentEdit.name
    // });
    console.log(this.editForm);
    this.editForm.patchValue({
      studentName: this.currentStudentEdit.name
    });
    console.log(this.currentStudentEdit);
    console.log(this.currentStudentIndex);
  }

  onSubmit(editForm: FormGroup) {
    this.savingProcess = true;
    this.studentService.students.find(stu => stu.id === this.currentStudentEdit.id).name = editForm.value.studentName;
    this.studentFireId = this.studentService.studentsArrayWithFireId.find(stu => stu.id === this.currentStudentEdit.id).fireId;
    if (this.studentFireId) {
      this.http.patch('https://random-select.firebaseio.com/students/' + this.studentFireId + '.json', {
        name: editForm.value.studentName
      })
        .subscribe(
          () => {
            if (!this.selectedImage) {
              this.savedSuccess = true;
              this.savingProcess = false;
              this.timeOut = setTimeout(() => {
                this.savedSuccess = false;
              }, 2000);
            }
          }
        );
    }
    if (this.selectedImage !== null) {
      const filePath = `studentImages/${this.currentStudentId}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          finalize(
            () => {
              fileRef.getDownloadURL().subscribe(
                (url) => {
                  this.studentService.students.find(stu => stu.id === this.currentStudentEdit.id).imageUrl = url;
                  this.currentStudentEdit.imageUrl = url;
                  this.studentService.studentsChanged.next(this.studentService.students);
                  this.savingProcess = false;
                  this.savedSuccess = true;
                  this.timeOut = setTimeout(() => {
                    this.savedSuccess = false;
                  }, 2000);
                }
              );
            }
          )
        )
        .subscribe();
    }
    this.studentService.studentsChanged.next(this.studentService.students);
  }

  onPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => this.currentStudentEdit.imageUrl = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      console.log(this.selectedImage);
    } else {
      this.selectedImage = null;
    }
  }

}
