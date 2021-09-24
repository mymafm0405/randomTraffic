import { StudentServiceService } from './../../shared/student-service.service';
import { GroupServiceService } from './../../shared/group-service.service';
import { Student } from './../../shared/student.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {
  @ViewChild('studentAddForm', {static: false}) studentAddForm: NgForm;
  selectedImage: null;
  addedSuccess = false;
  savingStatus: boolean;

  constructor(
    private storage: AngularFireStorage,
    private groupService: GroupServiceService,
    private studentService: StudentServiceService) { }

  ngOnInit() {
    this.studentService.studentAdded.subscribe(
      (addedStatus: boolean) => {
        if (addedStatus) {
          this.addedSuccess = true;
          this.savingStatus = false;
          this.studentAddForm.reset();
        }
      }
    );
  }

  onSubmit(studentAddForm: NgForm) {
    this.savingStatus = true;
    const studentId = new Date().getTime();
    if (this.selectedImage !== null) {
      const filePath = `studentImages/${studentId}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          finalize(
            () => {
              fileRef.getDownloadURL().subscribe(
                (url) => {
                  const newStudent: Student = {
                    id: studentId,
                    groupId: this.groupService.groupId,
                    name: studentAddForm.value.studentName,
                    imageUrl: url
                  };
                  this.studentService.addStudent(newStudent);
                }
              );
            }
          )
        )
        .subscribe();
    }
    console.log(studentAddForm);
  }

  onPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
      console.log(this.selectedImage);
    } else {
      this.selectedImage = null;
    }
  }

}
