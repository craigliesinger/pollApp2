import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room-full',
  templateUrl: './room-full.component.html',
  styleUrls: ['./room-full.component.scss']
})
export class RoomFullComponent implements OnInit {

  maxUsers: string = "10"

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.maxUsers = this.route.snapshot.paramMap.get('num');
  }

}
