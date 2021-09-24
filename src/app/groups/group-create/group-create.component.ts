import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { GroupServiceService } from './../../shared/group-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Group } from 'src/app/shared/group.model';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit {
  @ViewChild('createGroupForm', {static: false}) createGroupForm: NgForm;
  selectedImage = null;
  savingStatus = false;

  constructor(private groupService: GroupServiceService, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.groupService.groupAddedChanged.subscribe(
      (addedStatus: boolean) => {
        this.savingStatus = !addedStatus;
        this.createGroupForm.reset();
      }
    );
  }

  onSubmit(createGroupForm: NgForm) {
    this.savingStatus = true;
    const groupId = new Date().getTime();
    // Save the question image
    if (this.selectedImage !== null) {
      const filePath = `groupImages/${groupId}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          finalize(
            () => {
              fileRef.getDownloadURL().subscribe(
                (url) => {
                  const newGroup: Group = {
                    id: groupId,
                    name: createGroupForm.value.groupName,
                    imageUrl: url
                  };
                  this.groupService.addGroup(newGroup);
                }
              );
            }
          )
        )
        .subscribe();
    }
    //
    console.log(createGroupForm);
  }

  onPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
      console.log(this.selectedImage);
      console.log(this.selectedImage.name);
    } else {
      this.selectedImage = null;
    }
  }

}
