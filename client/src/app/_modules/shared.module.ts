import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right'
        }),
        NgxGalleryModule,
        NgxSpinnerModule.forRoot({
            type: 'line-scale-party'
        }),
		FileUploadModule,
		BsDatepickerModule.forRoot(),
    ],
    exports: [
        BsDropdownModule,
        TabsModule,
        ToastrModule,
        NgxGalleryModule,
        NgxSpinnerModule,
		FileUploadModule,
		BsDatepickerModule
    ]
})
export class SharedModule { }
