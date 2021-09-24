import { Group } from './group.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupServiceService {
  createGroupClicked = new Subject<boolean>();
  groupsChanged = new Subject<Group[]>();
  randomClicked = new Subject<boolean>();
  editClicked = new Subject<boolean>();
  groupIdChanged = new Subject<number>();
  groupAddedChanged = new Subject<boolean>();
  groupIndexChanged = new Subject<number>();
  groupIndex: number;
  groups: Group[] = [];
  groupId: number;
  section1Clicked = new Subject<boolean>();
  section2Clicked = new Subject<boolean>();
  showAllClicked = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  addGroup(group: Group) {

    this.http.post('https://random-select.firebaseio.com/groups.json', group)
      .subscribe(
        () => {
          this.groups.push(group);
          this.groups = this.groups.slice();
          this.groupsChanged.next(this.groups);
          this.groupAddedChanged.next(true);
          console.log('Group has been added successfully!');
        }
      );
  }
}
