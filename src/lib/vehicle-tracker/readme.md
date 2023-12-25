
# About the Tracker 

## What this Tracker does
Connects to a CCTV Feed, and listen for vehicular events for any incoming feeds. All the detection will need to do is to provide : 
1. License Plate in the Scene 
2. Snapshot of the Scene 
3. Bounding Box [Future]
4. Camera Id [Future]

## What the tracker does, is:
 1. Kill the Tracker, if they did not recec 
 2. Keep the Tracker alive, if they receive a Ping message 
 3. If the Tracker is alive for more than Z Seconds, sent a Overstay warning 
 4. If the Tracker is alive for beyond Y 

 ## Future Use 
 Well, we can use the same tracker in the following situations (Just needed to create something new to it)
 1. Vehicles @ Gantries for Visitor Management 
