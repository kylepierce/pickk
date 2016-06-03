#!/bin/bash

PLIST=platforms/ios/*/*-Info.plist

cat << EOF |
Add :SocialSharingExcludeActivities array
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.PostToFlickr
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.PostToWeibo
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.PostToVimeo
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.TencentWeibo
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.Mail
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.Print
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.CopyToPasteboard
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.AssignToContact
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.SaveToCameraRoll
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.AddToReadingList
Add :SocialSharingExcludeActivities: string com.apple.UIKit.activity.AirDrop
Add :SocialSharingExcludeActivities: string com.apple.reminders.RemindersEditorExtension
Add :SocialSharingExcludeActivities: string com.apple.mobilenotes.SharingExtension
EOF
while read line
do
    /usr/libexec/PlistBuddy -c "$line" $PLIST
done

true
