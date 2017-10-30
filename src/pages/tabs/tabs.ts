import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { Management } from '../management/management';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = Management;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
