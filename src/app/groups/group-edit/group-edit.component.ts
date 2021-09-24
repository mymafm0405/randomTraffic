import { Group } from './../../shared/group.model';
import { GroupServiceService } from './../../shared/group-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {
  groupId: number;
  currentGroup: Group;

  constructor(private groupService: GroupServiceService) { }

  ngOnInit() {
    this.groupId = this.groupService.groupId;
    this.currentGroup = this.groupService.groups.find(gro => gro.id === this.groupId);
    console.log(this.currentGroup);
    //
    this.groupService.groupIdChanged.subscribe(
      (updatedGroupId: number) => {
        this.groupId = updatedGroupId;
        this.currentGroup = this.groupService.groups.find(gro => gro.id === this.groupId);
        console.log(this.currentGroup);
      }
    );
    //
  }

}
