## This is the Analysis code for the FPWA project.
# Done by: Meqdad Darweesh

#   Importing Statements for Libraries
import pandas as pd
import numpy as np
import json
import objectpath
import matplotlib as plt

#   Analysis Code

# Reading the data samples

with open("......Write the path...dataSample.json") as datafile:
    data = json.load(datafile)



## Data Variables 

user_id = data['users'][0]['id']                                # User hashed ID.
user_country = data['users'][0]['country']                      # User country.
user_language = data['users'][0]['language']                    # Facebook account language.
user_gender = data['users'][0]['gender']['gender']              # User gender.
user_dob = data['users'][0]['gender']['age']                    # User DoB (Date of Birth).
user_actions_frequency = []                                     # Frequency for some user actions

print("The User ID: ", user_id)
print("User country: ", user_country)
print("Facebook language: ", user_language)
print("User gender: ", user_gender)
print("Date of Birth: ", user_dob)

print("\n")

## Searching Trees 

# Variable used in searching items in JSON fields [ User Actions ].
actions_tree = objectpath.Tree(data['actions'])

# Variable used in searching items in JSON fields [ User Friends ].
friends_tree = objectpath.Tree(data['users'][0]['friends'])

# Variable used in searching items in JSON fields [ User Applications].
apps_tree = objectpath.Tree(data['apps'])

# Variable used in searching items in JSON fields [ User Devices that used to login into his Facebook account].
devices_tree = objectpath.Tree(data['devices'][0]['devices'])

# Variable used in searching items in JSON fields [ User Groups].
groups_tree = objectpath.Tree(data['users'][0]['groups'])


## Extracted Variables

# Friends Variables

# First method to extract the Friends IDs is the traditional way
# for friends_id in data['users'][0]['friends']:
#     friends_ids.append(friends_id['id'])
# print("Friends IDs array: ", friends_ids)
# Second method to extract variables is using a library [ objectpath ]

friends_ids_tuple = tuple(friends_tree.execute('$..id'))            # Friends IDs.
friends_no = len(friends_ids_tuple)                                 # No. of friends
friends_gender_tuple = tuple(friends_tree.execute('$..gender'))     # Gender of Friends.
friends_gender_frequency_male = friends_gender_tuple.count(1)       # Counting how many are the males in friends list.
friends_gender_frequency_female = friends_gender_tuple.count(2)     # Counting how many are the females in friends list.
friends_gender_frequency_unknown = friends_gender_tuple.count(3)    # Counting how many are the unknowns in friends list.
# We are using an API for gender recognition. So, some friends gender is stay unknown, so we are counting how much of the unknows.

print("No. of friends: ", friends_no)                             # Printing the no. of Males.
print("No. of Males in friends list: ", friends_gender_frequency_male)                             # Printing the no. of Males.
print("Percentage of Males in friends list: %", ((friends_gender_frequency_male/friends_no) * 100))       # Percentage of Males.
print("No. of Females in friends list: ", friends_gender_frequency_female)                         # No. of Females.
print("Percentage of Females in friends list: %", ((friends_gender_frequency_female/friends_no) * 100))   # Percentage of Females.
print("No. of Unknown friends gender in friends list: ", friends_gender_frequency_unknown)                       # No. of Unknowns.
print("Percentage of Unknown friends gender in friends list: %", ((friends_gender_frequency_unknown/friends_no) * 100)) # Percentage of Unknowns.

print("\n")
## Groups Variables

# Traditional way to extract the variables.
# for user_groups_id in data['users'][0]['groups']:
#     user_groups_ids.append(user_groups_id['id'])
# print("Groups IDs array:", user_groups_ids)

user_groups_ids_tuple = tuple(groups_tree.execute('$..id'))                         # User groups IDs.
groups_no = len(user_groups_ids_tuple)                                         # Calculating the joined groups number
print("No. of user groups: ", groups_no)
user_groups_privacy_tuple = tuple(groups_tree.execute('$..privacy'))                # Types of the groups privacy.
print("The types of joined groups: ", set(user_groups_privacy_tuple))
user_secret_groups_tuple = user_groups_privacy_tuple.count('Secret Group')          # Counting the secret groups.
user_secret_groups_percentage_tuple = ((user_secret_groups_tuple/groups_no ) * 100) # Calculating the percentage of secret groups.
print("No. of secret groups: ", user_secret_groups_tuple)
print("Percentage of secret groups: %", user_secret_groups_percentage_tuple)
user_closed_groups_tuple = user_groups_privacy_tuple.count('Closed Group')          # Counting the closed groups.
user_closed_groups_percentage_tuple = ((user_closed_groups_tuple/groups_no ) * 100) # Calculating the percentage of closed groups.
print("No. of closed groups: ", user_closed_groups_tuple)
print("Percentage of closed groups: %", user_closed_groups_percentage_tuple)
user_public_groups_tuple = user_groups_privacy_tuple.count('Public Group')          # Counting the public groups.
user_public_groups_percentage_tuple = ((user_public_groups_tuple/groups_no ) * 100) # Calculating the percentage of public groups.
print("No. of public groups: ", user_public_groups_tuple)
print("Percentage of public groups: %", user_public_groups_percentage_tuple)

print("\n")
## Apps Variables

calculated_permissions_length = 0           # A variable used to store the asked permissions for apps in the user account.

# Traditional way......
# for user_app in data['apps'][0]['apps']:
#     user_apps_ids.append(user_app['appId'])
# print("Apps IDs array:", user_apps_ids)
apps_permissions_tuple = tuple(apps_tree.execute('$..name'))        # Storing all asked permissions.

print("All permissions that apps in the user account asked: ", set(apps_permissions_tuple))      # Printing all asked permissions.

apps_user_photos_permission_frequency = apps_permissions_tuple.count('user_photos')
print("No. of 'user_photos' permission: ", apps_user_photos_permission_frequency)
calculated_permissions_length += apps_user_photos_permission_frequency

apps_friends_videos_permission_frequency = apps_permissions_tuple.count('friends_videos')
print("No. of 'friends_videos' permission: ", apps_friends_videos_permission_frequency)
calculated_permissions_length += apps_friends_videos_permission_frequency

apps_read_stream_permission_frequency = apps_permissions_tuple.count('read_stream')
calculated_permissions_length += apps_read_stream_permission_frequency
print("No. of 'read_stream' permission: ", apps_read_stream_permission_frequency)

apps_email_permission_frequency = apps_permissions_tuple.count('email')
calculated_permissions_length += apps_email_permission_frequency
print("No. of 'email' permission: ", apps_email_permission_frequency)

apps_user_events_frequency = apps_permissions_tuple.count('user_events')
calculated_permissions_length += apps_user_events_frequency
print("No. of 'user_events' permission: ", apps_user_events_frequency)

apps_manage_pages_permission_frequency = apps_permissions_tuple.count('manage_pages')
calculated_permissions_length += apps_manage_pages_permission_frequency
print("No. of 'manage_pages' permission: ", apps_manage_pages_permission_frequency)

apps_user_location_permission_frequency = apps_permissions_tuple.count('user_location')
calculated_permissions_length += apps_user_location_permission_frequency
print("No. of 'user_location' permission: ", apps_user_location_permission_frequency)

apps_user_videos_permission_frequency = apps_permissions_tuple.count('user_videos')
calculated_permissions_length += apps_user_videos_permission_frequency
print("No. of 'user_videos' permission: ", apps_user_videos_permission_frequency)

apps_user_about_me_permission_frequency = apps_permissions_tuple.count('user_about_me')
calculated_permissions_length += apps_user_about_me_permission_frequency
print("No. of 'user_about_me' permission: ", apps_user_about_me_permission_frequency)

apps_friends_events_permission_frequency = apps_permissions_tuple.count('friends_events')
calculated_permissions_length += apps_friends_events_permission_frequency
print("No. of 'friends_events' permission: ", apps_friends_events_permission_frequency)

apps_friends_photos_permission_frequency = apps_permissions_tuple.count('friends_photos')
calculated_permissions_length += apps_friends_photos_permission_frequency
print("No. of 'friends_photos' permission: ", apps_friends_photos_permission_frequency)

apps_public_profile_permission_frequency = apps_permissions_tuple.count('public_profile')
calculated_permissions_length += apps_public_profile_permission_frequency
print("No. of 'public_profile' permission: ", apps_public_profile_permission_frequency)

apps_user_likes_permission_frequency = apps_permissions_tuple.count('user_likes')
calculated_permissions_length += apps_user_likes_permission_frequency
print("No. of 'user_likes' permission: ", apps_user_likes_permission_frequency)

print("\n")
## Printing percentage of permissions
apps_user_photos_permission_frequency_percentage = ((apps_user_photos_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'user_photos' permission: %", apps_user_photos_permission_frequency_percentage)

apps_friends_videos_permission_frequency_percentage = ((apps_friends_videos_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'friends_videos' permission: %", apps_friends_videos_permission_frequency_percentage)

apps_read_stream_permission_frequency_percentage = ((apps_read_stream_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'read_stream' permission: %", apps_read_stream_permission_frequency_percentage)

apps_email_permission_frequency_percentage = ((apps_email_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'email' permission: %", apps_email_permission_frequency_percentage)

apps_user_events_frequency_percentage = ((apps_user_events_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'user_events' permission: %", apps_user_events_frequency_percentage)

apps_manage_pages_permission_frequency_percentage = ((apps_manage_pages_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'manage_pages' permission: %", apps_manage_pages_permission_frequency_percentage)

apps_user_location_permission_frequency_percentage = ((apps_user_location_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'user_location' permission: %", apps_user_location_permission_frequency_percentage)

apps_user_videos_permission_frequency_percentage = ((apps_user_videos_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'user_videos' permission: %", apps_user_videos_permission_frequency_percentage)

apps_user_about_me_permission_frequency_percentage = ((apps_user_about_me_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'user_about_me' permission: %", apps_user_about_me_permission_frequency_percentage)

apps_friends_events_permission_frequency_percentage = ((apps_friends_events_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'friends_events' permission: %", apps_friends_events_permission_frequency_percentage)

apps_friends_photos_permission_frequency_percentage = ((apps_friends_photos_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'friends_photos' permission: %", apps_friends_photos_permission_frequency_percentage)

apps_public_profile_permission_frequency_percentage = ((apps_public_profile_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'public_profile' permission: %", apps_public_profile_permission_frequency_percentage)

apps_user_likes_permission_frequency_percentage = ((apps_user_likes_permission_frequency/calculated_permissions_length ) * 100)
print("Percentage of 'user_likes' permission: %", apps_user_likes_permission_frequency_percentage)

print("\n")
## Devices Variables

devices_os_tuple = tuple(devices_tree.execute('$..os'))
oss_number = len(devices_os_tuple)          # To store the no. of operating systems for used devices.
devices_os_tuple = tuple(devices_tree.execute('$..os'))
print("All OS for used devices: ", set(devices_os_tuple))# Printing all operating systems for used devices.
devices_os_windows_tuple = devices_os_tuple.count('Windows PC')
devices_os_windows_tuple_percentage = ((devices_os_windows_tuple / oss_number) * 100)
print("No. of devices with Windows OS: ", devices_os_windows_tuple)
print("Percentage of devices with Windows OS: %", devices_os_windows_tuple_percentage)

devices_os_linux_tuple = devices_os_tuple.count('Linux')
devices_os_linux_tuple_percentage = ((devices_os_linux_tuple / oss_number) * 100)
print("No. of devices with Linux OS: ", devices_os_linux_tuple)
print("Percentage of devices with Linux OS: %", devices_os_linux_tuple_percentage)

devices_os_mobile_tuple = oss_number - (devices_os_linux_tuple + devices_os_windows_tuple)
devices_os_mobile_tuple_percentage = ((devices_os_mobile_tuple / oss_number) * 100)
print("No. of devices with Mobiles OS: ", devices_os_mobile_tuple)
print("Percentage of devices with Mobiles OS: %", devices_os_mobile_tuple_percentage)

print("\n")
## Devices browser

devices_browser_tuple = tuple(devices_tree.execute('$..browser'))
print("The used browsers and apps to open the Facebook account: ", set(devices_browser_tuple))
num_devices_browsers = len(devices_browser_tuple)

devices_chrome_tuple = devices_browser_tuple.count('Chrome')
devices_chrome_percentage = ((devices_chrome_tuple / num_devices_browsers) * 100)
print("Percentage of Chrome browser: %", devices_chrome_percentage)

devices_messenger_tuple = devices_browser_tuple.count('Messenger')
devices_messenger_percentage = ((devices_messenger_tuple / num_devices_browsers) * 100)
print("Percentage of Messenger application: %", devices_messenger_percentage)

devices_facebook_app_tuple = devices_browser_tuple.count('Facebook app')
devices_facebook_app_percentage = ((devices_facebook_app_tuple / num_devices_browsers) * 100)
print("Percentage of Facebook application: %", devices_facebook_app_percentage)

print("\n")
## Actions Variables

# Gathering the types of actions that user had made.
user_actions_types_tuple = tuple(actions_tree.execute('$..type'))
all_action_types = set(user_actions_types_tuple)
print("All actions types: ", all_action_types)

saveLooked_action = user_actions_types_tuple.count('saveLooked')
user_actions_frequency.append(saveLooked_action)
print("No. of 'Watching post' action: ", saveLooked_action)

postData_action = user_actions_types_tuple.count('postData')
user_actions_frequency.append(postData_action )
print("No. of 'Viewed posts in the Newsfeed': ", postData_action )

topToolBarClicks_action = user_actions_types_tuple.count('action')
user_actions_frequency.append(topToolBarClicks_action)
print("No. of 'Top Toolbar Clicks (like: search, Home and accepting friend requests...etc.': ", topToolBarClicks_action )

contentLoaded_action = user_actions_types_tuple.count('contentLoaded')
user_actions_frequency.append(contentLoaded_action )
print("No. of 'Loaded contents in the page': ", contentLoaded_action )

switching_from_fb_to_another_tab_action = user_actions_types_tuple.count('blur')
user_actions_frequency.append(switching_from_fb_to_another_tab_action )
print("No. of 'Switching from Facebook to a website' action: ", switching_from_fb_to_another_tab_action )

switching_from_another_tab_to_fb_tab_action = user_actions_types_tuple.count('focus')
user_actions_frequency.append(switching_from_another_tab_to_fb_tab_action )
print("No. of 'Switching from a website to Facebook' action: ", switching_from_another_tab_to_fb_tab_action )

groups_actions = user_actions_types_tuple.count('/groups/profile.php:feed')
user_actions_frequency.append(groups_actions )
print("No. of 'groups posts in the Newsfeed': ", groups_actions )

openPage_actions = user_actions_types_tuple.count('openPage')
user_actions_frequency.append(openPage_actions )
print("No of 'Opening a new tab' action: ", openPage_actions )

closeWindow_actions = user_actions_types_tuple.count('closeWindow')
user_actions_frequency.append(closeWindow_actions )
print("No. of 'Closing a tab' action: ", closeWindow_actions )

visiting_user_profile_actions = user_actions_types_tuple.count('/profile_book.php:timeline')
user_actions_frequency.append(visiting_user_profile_actions )
print("No. of 'Visiting profile' action: ", visiting_user_profile_actions )

typing_actions = user_actions_types_tuple.count('typing')
user_actions_frequency.append(typing_actions)
print("No of 'Typing' action: ", typing_actions)

viewing_image_actions = user_actions_types_tuple.count('photos_snowlift')
user_actions_frequency.append(viewing_image_actions )
print("No. of Viewing image' action: ", viewing_image_actions )

links_clicks_actions = user_actions_types_tuple.count('WebPermalinkStreamController')
user_actions_frequency.append(links_clicks_actions )
print("No. of 'Links clicks' action: ", links_clicks_actions )

visiting_about_me_section_actions = user_actions_types_tuple.count('/profile_book.php:about')
user_actions_frequency.append(visiting_about_me_section_actions)
print("No. of 'Visiting about me section in profile' action: ", visiting_about_me_section_actions)

user_session_ids = set(tuple(actions_tree.execute('$..session')))
print("No of the user sessions: ", len(user_session_ids))

posts_contains_images = tuple(actions_tree.execute('$..postImg'))
print("No. of 'Posts contains images': ", sum(posts_contains_images))

print("\n")

duration_tuple = tuple(actions_tree.execute('$..duration'))
session_time = (sum(duration_tuple) * 1.2 / 60)
print("Average of sessions time: ", session_time)
print("Scrolling time: ", len(duration_tuple))

## This function is to convert the milliSeconds to Minutes
def milli_to_min(millis):
    millis = int(millis)
    seconds=(millis/1000)%60
    seconds = int(seconds)
    minutes=(millis/(1000*60))%60
    minutes = int(minutes)
    return minutes
user_timestamps = []

# timestamp_tuple = tuple(actions_tree.execute('$..timestamp'))
# print("number_user_timestamps_tuple", len(timestamp_tuple))
#
# for i,q in enumerate(timestamp_tuple):
#     user_timestamps.append(milli_to_min(timestamp_tuple[i]))


