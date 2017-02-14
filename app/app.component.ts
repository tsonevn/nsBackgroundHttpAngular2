import { Component, NgZone } from "@angular/core";
import {session, Session, Task} from "nativescript-background-http";
import {knownFolders } from "file-system";
import {Page} from "ui/page";
import {Image} from "ui/image";
import {Progress} from "ui/progress"
class tmpTask{
    upload: number;

    totalUpload: number;
}

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})
export class AppComponent { 
    public newsession:Session;
    public fileURL:string="";
    public request:any;
    public imageName:string="bigpic";
    private documents;
    public task:Task;
    public value = 0;

    constructor(private page:Page, private zone:NgZone){
         this.documents = knownFolders.currentApp();
         this.fileURL = this.documents.path+"/bigpic.jpg";
         this.newsession = session("image-upload");
         this.request = {
            url: "http://httpbin.org/post",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": this.imageName
            },
            description: "{ 'uploading': " + this.imageName + " }"
        };
    }
    onTap2(){
        var params = [{name: "test", value: "value"}, {name:"fileToUpload", filename: this.fileURL, mimeType: 'image/jpeg'}];
       this.task = this.newsession.multipartUpload(params, this.request);
       this.task.on("progress", (e)=>{
            var progress:Progress =<Progress> this.page.getViewById("prgressid");
            progress.value = e.currentBytes;
            progress.maxValue = e.totalBytes;
       });
       this.task.on("error", this.logEvent);
       this.task.on("complete", this.logEvent);
    }
    onTap(){
       this.task = this.newsession.uploadFile(this.fileURL, this.request);
       this.task.on("progress", (e)=>{
            var progress:Progress =<Progress> this.page.getViewById("prgressid");
            progress.value = e.currentBytes;
            progress.maxValue = e.totalBytes;
       });
       this.task.on("error", this.logEvent);
       this.task.on("complete", this.logEvent);
       
    }
    logEvent(e) {
        
        console.log("currentBytes: " + e.currentBytes);
        if((e.currentBytes != null) && (e.currentBytes !=undefined)){

            
        }
       
        
    }
}
