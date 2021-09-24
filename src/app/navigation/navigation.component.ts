import { GroupServiceService } from './../shared/group-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  currentCreateGroupStatus = false;
  constructor(private groupService: GroupServiceService) { }

  ngOnInit() {
  }

  onNewGroup() {
    this.currentCreateGroupStatus = !this.currentCreateGroupStatus;
    this.groupService.createGroupClicked.next(this.currentCreateGroupStatus);
  }

}
