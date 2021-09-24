import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupCreateComponent } from './groups/group-create/group-create.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { GroupIconComponent } from './groups/group-icon/group-icon.component';
import { GroupDataComponent } from './groups/group-data/group-data.component';
import { StudentsComponent } from './students/students.component';
import { StudentCreateComponent } from './students/student-create/student-create.component';
import { StudentSelectedComponent } from './students/student-selected/student-selected.component';
import { StudentEditComponent } from './students/student-edit/student-edit.component';
import { StudentDataComponent } from './students/student-data/student-data.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GroupsComponent,
    GroupCreateComponent,
    GroupEditComponent,
    GroupIconComponent,
    GroupDataComponent,
    StudentsComponent,
    StudentCreateComponent,
    StudentSelectedComponent,
    StudentEditComponent,
    StudentDataComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
