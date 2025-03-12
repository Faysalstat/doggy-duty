import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotfoundComponent } from './modules/components/notfound/notfound.component';
import { CountryService } from './modules/shared-services/country.service';
import { CustomerService } from './modules/shared-services/customer.service';
import { EventService } from './modules/shared-services/event.service';
import { IconService } from './modules/shared-services/icon.service';
import { NodeService } from './modules/shared-services/node.service';
import { PhotoService } from './modules/shared-services/photo.service';
import { ProductService } from './modules/shared-services/product.service';
import { AppLayoutModule } from './modules/layout/app.layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BrowserAnimationsModule,
        MaterialModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
