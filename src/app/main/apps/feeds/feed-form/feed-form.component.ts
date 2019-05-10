import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Feed } from 'app/main/apps/feeds/feed.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'feeds-feed-form-dialog',
  templateUrl: './feed-form.component.html',
  styleUrls: ['./feed-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeedsFeedFormDialogComponent {
  action: string;
  feed: Feed;
  feedForm: FormGroup;
  dialogTitle: string;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  /**
   * Constructor
   *
   * @param {MatDialogRef<FeedsFeedFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<FeedsFeedFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Feed Details';
      this.feed = _data.feed;
    } else {
      this.dialogTitle = 'New Feed';
      this.feed = new Feed({});
    }

    this.feedForm = this.createFeedForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  createFeedForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.feed.id],
      rssname: [this.feed.rssname],
      url: [this.feed.url]
    });
  }
}
