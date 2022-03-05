import { GroupServiceService } from "./shared/group-service.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "random-select";
  showCreateGroupForm = false;
  randomClicked: boolean;
  editClicked: boolean;
  section1 = true;
  section2 = false;
  constructor(private groupService: GroupServiceService) {}

  ngOnInit() {
    //
    this.groupService.createGroupClicked.subscribe(
      (createGroupStatus: boolean) => {
        this.showCreateGroupForm = createGroupStatus;
      }
    );
    //
    //
    this.groupService.editClicked.subscribe((editClickedStatus: boolean) => {
      this.editClicked = editClickedStatus;
    });
    //
    //
    this.groupService.randomClicked.subscribe((randomStatus: boolean) => {
      this.randomClicked = randomStatus;
    });
    //
    this.groupService.section1Clicked.subscribe((status: boolean) => {
      if (status) {
        this.section1 = true;
        this.section2 = false;
      }
    });
    this.groupService.section2Clicked.subscribe((status: boolean) => {
      if (status) {
        this.section2 = true;
        this.section1 = false;
      }
    });
  }
}
