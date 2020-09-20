import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
import { AppInfo } from 'src/app/models';

@Component({
  selector: 'app-all-roles',
  templateUrl: './all-roles.component.html',
  styleUrls: ['./all-roles.component.scss']
})
export class AllRolesComponent implements OnInit {

  @Select(AppState.appInfo) appInfo$: Observable<AppInfo>;

  columns:string[] = [
    'id','name','desc'
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
