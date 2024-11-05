import { Component } from '@angular/core';

@Component({
  selector: 'content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

    contentItems = [
        {title: 'Section 1', text: 'This is the first section.'},
        {title: 'Section 2', text: 'More information in this section.'},
        {title: 'Section 3', text: 'Another section with details.'},
        // Add more sections as needed
    ];

}
