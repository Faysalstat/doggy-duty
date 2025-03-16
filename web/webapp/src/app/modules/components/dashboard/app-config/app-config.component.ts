import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.scss'],
})
export class AppConfigComponent implements OnInit {
  configList!:any[];
  configName!:string;
  value!:string;
  constructor(
    private communityServcie: CommunityService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchAppConfigList();
  }

  fetchAppConfigList() {
    this.communityServcie.getAllConfig().subscribe({
      next:(res)=>{
        console.log(res);
        this.configList = res.body;
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    });
  }

  onSubmit(){
    let payload = {
      configName:this.configName,
      value:this.value
    }
    this.communityServcie.updateConfig(payload).subscribe({
      next:(res)=>{
        console.log(res);
        this.configName = '';
        this.value = '';
        this.messageService.add({ severity: 'success', summary: 'Updated', detail:"Updated Successfully"});
        this.fetchAppConfigList();
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    })
  }
  onEdit(config:any){
    this.configName = config.configName;
    this.value = config.value;
  }
}
